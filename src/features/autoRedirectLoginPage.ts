//Login page = https://learnit.itu.dk/login/index.php
function detectLoginPage() {
  const url = window.location.href
  if (!url.endsWith("/login/index.php")) return false
  const loginText = document.querySelector("#modal-body > p")
  if (loginText == null) return false

  if (!loginText.textContent.includes("You are already logged in")) return false
  return true
}

export function autoRedirectLoginPage() {
  if (!detectLoginPage()) return
  console.log("Detected logout confirm page. Redirecting to front page...")

  //Redirect to front page
  window.location.href = "https://learnit.itu.dk/my/"
}
