addEventListener('DOMContentLoaded', (event) => {
	const userName = document.querySelector('#username')
	const userSurname = document.querySelector('#users-surname')
	const userEmail = document.querySelector('#userEmail')
	const userPassword = document.querySelector('#userPassword')
	const userPassword2 = document.querySelector('#userPassword2')
	const userRegisterBtn = document.querySelector('.userRegisterBtn')

	const showError = (input, msg) => {
		const formBox = input.parentElement
		const errorMsg = formBox.querySelector('.form__group-paragraph--error')

		formBox.classList.add('error')
		errorMsg.textContent = msg
	}

	const checkLength = (input, min) => {
		if (input.value.length < min) {
			showError(input, `${input.placeholder} składa się z mniej niż ${min} znaków`)
		}
	}

	const clearError = (input) => {
		const formBox = input.parentElement
		formBox.classList.remove('error')
	}

	const checkEmail = (email) => {
		const regularExpression =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+\.)+[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ]{2,}))$/

		if (regularExpression.test(email.value)) {
			clearError(email)
		} else {
			showError(email, 'Niepoprawny adres e-mail')
		}
	}

	const checkNameForms = (input) => {
		const regularExpression = /^[A-Za-z]{2,20}$/

		if (regularExpression.test(input.value)) {
			clearError(input)
		} else {
			showError(input, 'Niepoprawne imie')
		}
	}

	const checkSurNameForms = (input) => {
		const regularExpression = /^[A-Za-z]{2,20}$/

		if (regularExpression.test(input.value)) {
			clearError(input)
		} else {
			showError(input, 'Niepoprawne nazwisko')
		}
	}

	const checkPasswords = (input1, input2) => {
		const regularExpression = /^(?=.*[A-ZĄĆĘŁŃÓŚŹŻ])(?=.*\d)[\x20-\x7EĄĆĘŁŃÓŚŹŻa-zA-Z0-9ĄĆĘŁŃÓŚŹŻ]{8,}$/



		if (input1.value === '') {
			showError(input1, input1.placeholder)
		} else {
			if (regularExpression.test(input1.value)) {
				clearError(input1)
			} else {
				showError(input1, 'Hasło musi składać się z 8 znaków, co najmniej 1 wielkiej litery i 1 cyfry')
			}
		}

		if (input2.value === '') {
			showError(input2, input2.placeholder)
		} else {
			if (regularExpression.test(input2.value)) {
				clearError(input2)
			} else {
				showError(input2, 'Hasło musi składać się z 8 znaków, co najmniej 1 wielkiej litery i 1 cyfry')
			}
		}
	}

	const checkForm = (input) => {
		input.forEach((item) => {
			if (item.value === '') {
				showError(item, item.placeholder)
			} else {
				clearError(item)
			}
		})
	}

	const checkForm2 = (item) => {
		if (item.value === '') {
			showError(item, item.placeholder)
		} else {
			clearError(item)
		}
	}

	userRegisterBtn.addEventListener('click', (e) => {
		e.preventDefault()

		checkForm([userName, userSurname, userEmail])
		checkNameForms(userName)
		checkSurNameForms(userSurname)
		checkLength(userName, 2)
		checkLength(userSurname, 2)
		checkEmail(userEmail)
		checkPasswords(userPassword, userPassword2)
	})

	const checkUsernameContent = () => {
		checkForm2(userName)
		checkNameForms(userName)
		checkLength(userName, 2)
	}

	userName.addEventListener('keyup', checkUsernameContent)

	const checkUserSurnameContent = () => {
		checkForm2(userSurname)
		checkSurNameForms(userSurname)
		checkLength(userSurname, 2)
	}

	userSurname.addEventListener('keyup', checkUserSurnameContent)

	const checkUserEmailContent = () => {
		checkForm2(userEmail)
		checkEmail(userEmail)
	}

	userEmail.addEventListener('keyup', checkUserEmailContent)
})
