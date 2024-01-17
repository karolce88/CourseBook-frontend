addEventListener('DOMContentLoaded', (event) => {
	const userEmail = document.querySelector('#userEmail')
	const userPassword = document.querySelector('#userPassword')
	const userLoginBtn = document.querySelector('.userLoginBtn')

	const formData = new FormData(form);
	const csrfToken = formData.get("csrfmiddlewaretoken");


	

	userRegisterBtn.addEventListener('click', (e) => {
		e.preventDefault()

		checkLogin(userEmail)
		checkLoginEmail(userEmail)


		fetch("register-customer", {
			method: "POST",
			headers: {
				"X-CSRFToken": csrfToken,
			},
			body: formData,
		});
	})


	const checkUserEmailContent = () => {
		checkForm2(userEmail)
		checkEmail(userEmail)
	}

	userEmail.addEventListener('keyup', checkUserEmailContent)
})
