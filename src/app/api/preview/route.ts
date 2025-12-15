import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import dns from "dns/promises";
import { cookies } from "next/headers";
import db from "@/lib/db";


const SCREENSHOT_WIDTH = 1800;
const SCREENSHOT_HEIGHT = 992;
const NAVIGATION_TIMEOUT_MS = 15000;

export async function POST(request: NextRequest) {
  try {
    const { url: rawUrl } = await request.json();

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `url`." },
        { status: 400 }
      );
    }

    const url = new URL(rawUrl);

    let response;
    try {
      // Vulnerability: Node fetch will fail if the URL is not HTTP/HTTPS,
      // but since we don't return immediately after this check,
      // SSRF to other protocols is still possible via Puppeteer.
      response = await fetch(url.toString(), {
        method: "GET",
        redirect: "follow",
        headers: {
          "x-internal-request": "1",
        },
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
    });
   
    
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("text/html")) {
      return NextResponse.json(
        {
          url: url.toString(),
          contentType,
          status: response?.status,
          title: null,
          description: null,
          image: null,
          screenshot: null,
        },
        { status: 200 }
      );
    }

    // Load the HTML with cheerio to extract metadata
    const html = (await response?.text()) || "";
    const $ = cheerio.load(html);

    //const ogTitle = $('meta[property="og:title"]').attr("content");
    //const ogDescription = $('meta[property="og:description"]').attr("content");
    const ogImage = $('meta[property="og:image"]').attr("content");

    //const title = ogTitle || $("title").first().text() || null;
    // const description =
    //  ogDescription || $('meta[name="description"]').attr("content") || null;
    const image =
      ogImage || $('meta[name="twitter:image"]').attr("content") || null;

    let screenshot: string | null = null;
    let effectiveURL: string | null = null;
    let title : string | null = null;
    let description: string | null = null;
    let city: string | null = null;
    let region: string | null = null;
    let country: string | null = null;
    
    try {
      // Launch Puppeteer to capture a screenshot
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      try {
        const page = await browser.newPage();

        await page.setViewport({
          width: SCREENSHOT_WIDTH,
          height: SCREENSHOT_HEIGHT,
        });

        // Special header to allow internal access, see src/proxy.ts for details
        await page.setExtraHTTPHeaders({
          "x-internal-request": "1",
        });

        // Vulnerability: Puppeteer spins up a browser that can navigate to arbitrary URLs,
        // including file:// URLs and internal network addresses.
        await page.goto(url.toString(), {
          waitUntil: "networkidle2",
          timeout: NAVIGATION_TIMEOUT_MS,
        });

        // Capture screenshot
        const buffer = (await page.screenshot({
          fullPage: false,
          type: "png",
        })) as Buffer;

        screenshot = `data:image/png;base64,${buffer.toString("base64")}`;
        effectiveURL = page.url();
        const metadata = await page.evaluate(() => {
        const titleSelector = `meta[property="og:title"]`;
        const ogTitleTag = document.querySelector(titleSelector);
        if (ogTitleTag)
          title = ogTitleTag.getAttribute('content');

        const descSelector = `meta[property="og:description"]`;
        const ogDescTag = document.querySelector(descSelector);

        if (ogDescTag)
          description = ogDescTag.getAttribute('content');
        return { title, description };
      });
      title = metadata.title || null;
      description = metadata.description || null;
        
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.error("Screenshot capture failed:", error);
      screenshot = null;
    }

    // Perform DNS lookups
    let ipv4 = null;
    let ipv6 = null;
    try {
      ipv4 = (await dns.lookup(url.hostname, { family: 4 })).address;
    } catch (error) {
      console.error('DNS lookup failed:', error);
    }
    try {
      ipv6 = (await dns.lookup(url.hostname, { family: 6 })).address;
    } catch (error) {
      console.error('DNS lookup failed:', error);
    }
    if (ipv4) {
    try {
      const ipinfoToken = process.env.IPINFO_API_KEY;
      const ipinfoUrl = ipinfoToken 
        ? `https://ipinfo.io/${ipv4}/json?token=${ipinfoToken}`
        : `https://ipinfo.io/${ipv4}/json`;
      const geoResponse = await fetch(ipinfoUrl);
      const geoData = await geoResponse.json();

      city = geoData.city;
      region = geoData.region;
      country = geoData.country;
      console.log(geoData);
      // number: geoData.asn,
      //  organization: geoData.org
    } catch (error) {
      console.error('Geolocation lookup failed:', error);
    }
  }
  console.log(`https://ipapi.co/${ipv4}/json/`);
  console.log("city ", city, " region ", region, " country ", country);
    const dnsRecords: Record<string, string[] | string[][] | null> = {
      A: null,
      AAAA: null,
      CNAME: null,
    };
    try {
      dnsRecords.A = await dns.resolve4(url.hostname);
    } catch {}
    try {
      dnsRecords.AAAA = await dns.resolve6(url.hostname);
    } catch {}
    try {
      dnsRecords.CNAME = await dns.resolveCname(url.hostname);
    } catch (error) {
      console.log('CNAME lookup failed:', error);
    }

    // Save to search history if user is logged in
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId");
    if (userId) {
      try {
        db.prepare(
          "INSERT INTO search_history (user_id, url) VALUES (?, ?)"
        ).run(userId.value, url.toString());
      } catch (error) {
        console.error("Failed to save search history:", error);
      }
    }

    return NextResponse.json(
      {
        hostname: url.hostname,
        effectiveURL, 
        status: response.status,
        contentType,
        ipv4,
        ipv6,
        city,
        region,
        country,
        dnsRecords,
        title,
        description,
        image,
        screenshot,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Preview API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch URL preview." },
      { status: 500 }
    );
  }
}
