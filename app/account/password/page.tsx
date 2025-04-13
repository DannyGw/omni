import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PasswordForm } from "@/components/password-form"

export default async function PasswordPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      <PasswordForm />
    </div>
  )
}
