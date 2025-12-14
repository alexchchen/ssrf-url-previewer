export default function InternalAdminDebugPage() {
  // Fake data for demonstration purposes
  const fakeEnvVars = [
    { key: "NODE_ENV", value: "production" },
    { key: "ADMIN_API_KEY", value: "supersecret-admin-key-123" },
    { key: "JWT_SECRET", value: "jwt-dev-secret-not-for-prod" },
    { key: "DB_PASSWORD", value: "P@ssw0rd!" },
    { key: "INTERNAL_SERVICE_URL", value: "http://10.0.2.14:9000" },
  ];

  const fakeSystemInfo = {
    version: "1.4.0",
    build: "debug",
    uptime: "12 days, 4 hours, 33 minutes",
    hostname: "previewer-core-01.internal",
    internalIp: "10.0.2.14",
  };

  const fakeRecentRequests = [
    {
      id: 1,
      method: "GET",
      path: "/api/preview",
      user: "alice",
      internalTarget: "http://localhost:3000/internal/admin-debug",
      status: 200,
    },
    {
      id: 2,
      method: "GET",
      path: "/api/preview",
      user: "bob",
      internalTarget: "http://10.0.0.5:5432",
      status: 500,
    },
    {
      id: 3,
      method: "GET",
      path: "/api/preview",
      user: "charlie",
      internalTarget: "http://169.254.169.254/latest/meta-data/",
      status: 200,
    },
  ];

  return (
    <main className="mx-auto my-10 max-w-[900px] p-6 font-sans">
      {/* Header */}
      <header className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
        <h1 className="m-0 text-2xl font-bold text-red-700">
          Internal Admin Debug Panel
        </h1>
        <p className="mt-2 text-sm text-red-900">
          This page is intended for internal use only. If you are seeing this
          page from outside the internal network, something is seriously wrong.
        </p>
      </header>

      {/* System Info */}
      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mt-0 text-lg font-semibold text-gray-900">
          System Information
        </h2>
        <dl className="m-0 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="font-semibold text-gray-600">Version</dt>
          <dd className="m-0 text-gray-900">{fakeSystemInfo.version}</dd>

          <dt className="font-semibold text-gray-600">Build</dt>
          <dd className="m-0 text-gray-900">{fakeSystemInfo.build}</dd>

          <dt className="font-semibold text-gray-600">Uptime</dt>
          <dd className="m-0 text-gray-900">{fakeSystemInfo.uptime}</dd>

          <dt className="font-semibold text-gray-600">Hostname</dt>
          <dd className="m-0 text-gray-900">{fakeSystemInfo.hostname}</dd>

          <dt className="font-semibold text-gray-600">Internal IP</dt>
          <dd className="m-0 text-red-600">{fakeSystemInfo.internalIp}</dd>
        </dl>
      </section>

      {/* Environment Variables */}
      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mt-0 mb-2 text-lg font-semibold text-gray-900">
          Environment Variables
        </h2>
        <pre className="m-0 overflow-x-auto rounded-lg bg-gray-900 p-3 text-[13px] text-emerald-100">
          {fakeEnvVars.map((env) => `${env.key}=${env.value}`).join("\n")}
        </pre>
      </section>

      {/* Recent Requests */}
      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mt-0 mb-2 text-lg font-semibold text-gray-900">
          Recent Requests
        </h2>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-[13px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-2.5 py-2 text-left text-gray-600">ID</th>
                <th className="px-2.5 py-2 text-left text-gray-600">Method</th>
                <th className="px-2.5 py-2 text-left text-gray-600">Path</th>
                <th className="px-2.5 py-2 text-left text-gray-600">User</th>
                <th className="px-2.5 py-2 text-left text-gray-600">
                  Internal Target
                </th>
                <th className="px-2.5 py-2 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {fakeRecentRequests.map((req) => (
                <tr key={req.id}>
                  <td className="border-t border-gray-200 px-2.5 py-2 text-gray-900">
                    {req.id}
                  </td>
                  <td className="border-t border-gray-200 px-2.5 py-2 font-semibold text-blue-600">
                    {req.method}
                  </td>
                  <td className="border-t border-gray-200 px-2.5 py-2 text-gray-900">
                    {req.path}
                  </td>
                  <td className="border-t border-gray-200 px-2.5 py-2 text-gray-900">
                    {req.user}
                  </td>
                  <td className="border-t border-gray-200 px-2.5 py-2 font-mono text-red-600">
                    {req.internalTarget}
                  </td>
                  <td
                    className={`border-t border-gray-200 px-2.5 py-2 font-semibold ${
                      req.status >= 200 && req.status < 300
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {req.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
