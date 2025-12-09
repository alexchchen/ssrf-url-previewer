import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import dns from "dns/promises";

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
          status: response.status,
          title: null,
          description: null,
          image: null,
          screenshot: null,
        },
        { status: 200 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const ogTitle = $('meta[property="og:title"]').attr("content");
    const ogDescription = $('meta[property="og:description"]').attr("content");
    const ogImage = $('meta[property="og:image"]').attr("content");

    const title = ogTitle || $("title").first().text() || null;
    const description =
      ogDescription || $('meta[name="description"]').attr("content") || null;
    const image =
      ogImage || $('meta[name="twitter:image"]').attr("content") || null;

    let screenshot: string | null = null;
    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      try {
        const page = await browser.newPage();
        await page.setViewport({
          width: SCREENSHOT_WIDTH,
          height: SCREENSHOT_HEIGHT,
        });
        await page.goto(url.toString(), {
          waitUntil: "networkidle2",
          timeout: NAVIGATION_TIMEOUT_MS,
        });
        const buffer = (await page.screenshot({
          fullPage: false,
          type: "png",
        })) as Buffer;
        screenshot = `data:image/png;base64,${buffer.toString("base64")}`;
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.error("Screenshot capture failed:", error);
      screenshot = null;
    }

    let ipv4 = null;
    let ipv6 = null;
    try {
      ipv4 = (await dns.lookup(url.hostname, { family: 4 })).address;
    } catch {}
    try {
      ipv6 = (await dns.lookup(url.hostname, { family: 6 })).address;
    } catch {}

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
    } catch {}

    return NextResponse.json(
      {
        url: url.toString(),
        status: response.status,
        contentType,
        ipv4,
        ipv6,
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
