import { getUserById } from "@/lib/users"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import { cookies } from "next/headers"

export default async function ProfilePage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    redirect("/auth/login")
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    const user = await getUserById(session.userId)

    if (!user) {
      redirect("/auth/login")
    }

    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
        <ProfileForm user={user} />
      </div>
    )
  } catch (error) {
    console.error("Error parsing session:", error)
    redirect("/auth/login")
  }
}
