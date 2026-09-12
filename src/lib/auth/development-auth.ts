const RESET_EMAIL_KEY = "aurevia-password-reset-email"
const RESET_REQUEST_KEY = "aurevia-password-reset-requested"

const wait = (milliseconds = 650) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds))

async function developmentSignIn(email: string, password: string) {
  await wait()
  if (email.toLowerCase() === "invalid@example.com" || password === "invalid-password") {
    return { ok: false as const, message: "We couldn't sign you in with those credentials." }
  }
  return { ok: true as const }
}

async function requestDevelopmentPasswordReset(email: string) {
  await wait()
  window.sessionStorage.setItem(RESET_EMAIL_KEY, email)
  window.sessionStorage.setItem(RESET_REQUEST_KEY, "true")
}

async function completeDevelopmentPasswordReset() {
  await wait()
  window.sessionStorage.removeItem(RESET_REQUEST_KEY)
}

export {
  RESET_EMAIL_KEY,
  RESET_REQUEST_KEY,
  completeDevelopmentPasswordReset,
  developmentSignIn,
  requestDevelopmentPasswordReset,
}
