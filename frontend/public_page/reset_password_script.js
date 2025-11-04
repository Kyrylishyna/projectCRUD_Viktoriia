document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reset_form");
    const message = document.getElementById("reset_message");

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    form.addEventListener("submit", async (e) => {
        
            e.preventDefault();

            const password = form.password.value;
            const confirm = form.confirm.value;

            if(password !== confirm){
                message.textContent = "Passwords do not match!";
                message.style.color = "red";
                return;
            }

            try{
                const response = await fetch("https://projectcrud-viktoriia2.onrender.com/api/users/reset-password", {
                    method: "POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({token,password}),
                });

                const data = await response.json();
                if(response.ok){
                    message.textContent = "Password updated! You can now log in"
                    message.style.color = "green";

                    setTimeout(() => {
                        window.location.href = "/public_page/public_page.html";
                    }, 2000);
                }else {
                    message.textContent = data.message || "Something went wrong";
                    message.style.color = "red";
                }
            }catch(err){
                console.error(err);
                message.textContent = "Server error";
                message.style.color = "red";
            }
        
    });
});