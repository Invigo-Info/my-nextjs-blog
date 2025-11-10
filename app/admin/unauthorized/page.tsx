import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md text-center">
        <div>
          <h1 className="text-6xl font-bold text-red-600">403</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Unauthorized Access
          </h2>
          <p className="mt-2 text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Only administrators can access the admin dashboard.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <Link
            href="/"
            className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Home
          </Link>
          <Link
            href="/admin/login"
            className="block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Try Different Account
          </Link>
        </div>
      </div>
    </div>
  )
}
