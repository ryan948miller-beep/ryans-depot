import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// LOGIN
loginBtn.onclick = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  await signInWithRedirect(auth, provider);
};

// HANDLE RETURN FROM GOOGLE
getRedirectResult(auth)
  .then((result) => {
    if (result?.user) {
      console.log("Logged in:", result.user);
    }
  })
  .catch((error) => {
    console.error("Redirect login error:", error);
  });
