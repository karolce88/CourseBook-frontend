// const { create } = require('browser-sync')

addEventListener('DOMContentLoaded', (event) => {
	let isEdit = false
	const alerts = document.querySelectorAll('.alert')
	if (alerts) {
		alerts.forEach((alert) => {
			const deley = setTimeout(() => {
				alert.classList.add('alert__hide')
			}, 2000)
		})
	}

	const backdropActivate = (overlay) => {
		overlay.classList.add('overlay--active')
		document.body.classList.add('no-scroll')
	}

	const backdropDeActivate = (overlay) => {
		overlay.classList.remove('overlay--active')
		document.body.classList.remove('no-scroll')
	}

	const drawer = document.querySelector('.drawer')
	if (drawer) {
		const overlay = document.querySelector('.overlay')
		const accountAddBtn = document.querySelector('.jsAccountAdd')
		const drawerBackBtn = drawer.querySelector('.drawer__back')

		accountAddBtn.addEventListener('click', () => {
			drawer.classList.add('drawer--active')
			backdropActivate(overlay)
			isEdit = false
		})

		drawerBackBtn.addEventListener('click', () => {
			drawer.classList.remove('drawer--active')
			backdropDeActivate(overlay)
		})
	}

	const handleShadowNavigation = () => {
		if (window.scrollY > 148) {
			navigationElement.classList.add('nav--shadow')
		} else {
			navigationElement.classList.remove('nav--shadow')
		}
	}

	const navigationElement = document.querySelector('.nav')
	if (navigationElement) {
		window.addEventListener('scroll', handleShadowNavigation)
	}

	//   tworzenie kursu i instruktora
	///////////////////////////////////////////
	const form = document.querySelector('.jsCourseForm')
	if (form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault()
			const formData = new FormData(form)
			const fileInputs = form.querySelectorAll('input[type="file"]')
			fileInputs.forEach((input) => {
				const files = input.files
				for (let i = 0; i < files.length; i++) {
					const file = files[i]
					formData.append('uploaded_images', file)
				}
			})

			const csrfToken = formData.get('csrfmiddlewaretoken')

			fetch('/account-courses', {
				method: 'POST',
				headers: {
					'X-CSRFToken': csrfToken,
				},
				body: formData,
			})
				.then((response) => {
					console.log(response)
					if (response.ok) {
						location.reload()
					} else {
						location.reload()
					}
				})
				.catch((error) => {
					console.log(error)
				})
		})
	}

	//   poprawić tego JS żeby lepiej działał
	//   zamiast instructorId w js dodac do formularza inputa hidden z ID i ponim potem reszte logiki
	// edycja instruktora
	//   //////////////////////////////
	const instructorForm = document.querySelector('.jsInstructorForm')
	const instructorEditBtns = document.querySelectorAll('.jsInstructorEdit')
	let instructorId
	instructorEditBtns.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			isEdit = true
			instructorId = btn.dataset.id
			fetch('/edit-instructor/' + instructorId, {
				method: 'GET',
			})
				.then((response) => response.json())
				.then((data) => {
					const overlay = document.querySelector('.overlay')
					backdropActivate(overlay)
					drawer.classList.add('drawer--active')
					instructorForm.querySelector("[name='first_name']").value = data.first_name
					instructorForm.querySelector("[name='last_name']").value = data.last_name
					instructorForm.querySelector("[name='description']").value = data.description
					// tu trzeba zmienić potem bo cały czas jest form i jest margines
					if (data.photo) {
						const photoPreview = instructorForm.querySelector('.photo-preview')
						photoPreview.src = data.photo_thumb
					}
				})
		})
	})

	if (instructorForm) {
		instructorForm.addEventListener('submit', (e) => {
			e.preventDefault()
			const formData = new FormData(instructorForm)
			const csrfToken = formData.get('csrfmiddlewaretoken')
			fetch(isEdit ? '/edit-instructor/' + instructorId : '/account-instructors', {
				method: isEdit ? 'PUT' : 'POST',
				headers: {
					'X-CSRFToken': csrfToken,
				},
				body: formData,
			})
				.then((response) => {
					instructorForm.reset()
					console.log(response)
					if (response.ok) {
						location.reload()
					} else {
						location.reload()
					}
				})
				.catch((error) => {
					console.log(error)
				})
		})
	}

	const formImages = document.querySelectorAll('.form__images-image')
	formImages.forEach((image) => {
		image.addEventListener('change', (e) => {
			const input = image.querySelector('input')
			const fileNameSpan = image.querySelector('span')
			if (input.files.length > 0) {
				fileNameSpan.textContent = `${input.files[0].name}`
			} else {
				fileNameSpan.textContent = 'Wybierz zdjęcie'
			}
		})
	})

	// const addFormImage = document.querySelector('.jsAddImage')
	// if (addFormImage) {
	// 	const imagesContainer = document.querySelector('.form__images')

	// 	addFormImage.addEventListener('click', e => {
	// 		e.preventDefault()
	// 		const input = document.createElement('input')
	// 		input.classList.add('form__group-input')
	// 		input.type = 'file'
	// 		input.name = 'images'
	// 		input.addEventListener('change', e => {
	// 			const selectedFile = e.target.files[0]
	// 			if (selectedFile) {
	// 				const imageContainer = document.createElement('div')
	// 				const deleteElement = document.createElement('div')
	// 				const imageElement = document.createElement('img')
	// 				imageContainer.classList.add('form__images-image')
	// 				deleteElement.classList.add('form__images-delete')
	// 				deleteElement.innerHTML = `
	// 	  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
	// 	  fill="none" stroke="white" stroke-width="2" stroke-linecap="round"
	// 	  stroke-linejoin="round" class="feather feather-x">
	// 	  <line x1="18" y1="6" x2="6" y2="18"></line>
	// 	  <line x1="6" y1="6" x2="18" y2="18"></line>
	//   		</svg>
	//   		`
	// 				imageElement.width = 150
	// 				imageElement.height = 150
	// 				imageElement.loading = 'lazy'
	// 				imageElement.src = `https://placehold.co/150x150?text=${selectedFile.name}`
	// 				imagesContainer.appendChild(imageContainer)
	// 				imageContainer.appendChild(deleteElement)
	// 				imageContainer.appendChild(imageElement)
	// 				imageContainer.insertBefore(input, imageContainer.lastChild)
	// 				deleteElement.addEventListener('click', e => {
	// 					const elementToDelete = e.target.closest('.form__images-image')
	// 					elementToDelete.remove()
	// 				})
	// 			}
	// 		})
	// 		input.click()
	// 	})
	// }

	// wysuwanie kosza:

	const showCartIcon = document.querySelector('.nav__right-cart')
	const drawerCart = document.querySelector('.nav__cart')
	const overlay = document.querySelector('.overlay')

	showCartIcon.addEventListener('click', () => {
		drawerCart.classList.add('nav__cart-showcart')
		backdropActivate(overlay)

		const closeCartIcon = document.querySelector('.nav__cart-head-closebtn')

		closeCartIcon.addEventListener('click', () => {
			drawerCart.classList.remove('nav__cart-showcart')

			backdropDeActivate(overlay)
		})
	})

	// tworzenie elementu z kursem w koszu:

	const createCartElement = () => {
		const newOrder = document.querySelector('.nav__cart-container-boxes')

		newOrder.innerHTML = `<div class="nav__cart-container-boxes-box"> <img class="nav__cart-container-boxes-box-img" src="https://azarog.pythonanywhere.com/media/course_images/kreatywne-gotowanie-roslinne/zdjecie_3_orginal.jpg">
	<div class="nav__cart-container-boxes-box-content">
		 <p class="nav__cart-container-boxes-box-content-title">Dodany element przez JS</p>
		 <div>
			  <div class="nav__cart-container-boxes-box-content-data">
					<svg class="nav__cart-container-boxes-box-content-svgicon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
						 <path d="M8.48734 9.654L9.304 8.82275L7.58317 7.10192V4.6665H6.4165V7.58317L8.48734 9.654ZM6.4165 3.49984H7.58317V2.33317H6.4165V3.49984ZM10.4998 7.58317H11.6665V6.4165H10.4998V7.58317ZM6.4165 11.6665H7.58317V10.4998H6.4165V11.6665ZM2.33317 7.58317H3.49984V6.4165H2.33317V7.58317ZM6.99984 12.8332C6.19289 12.8332 5.43456 12.6799 4.72484 12.3735C4.01512 12.0671 3.39775 11.6515 2.87275 11.1269C2.34775 10.6019 1.93223 9.98456 1.62617 9.27484C1.32012 8.56511 1.16689 7.80678 1.1665 6.99984C1.1665 6.19289 1.31973 5.43456 1.62617 4.72484C1.93262 4.01512 2.34814 3.39775 2.87275 2.87275C3.39775 2.34775 4.01512 1.93223 4.72484 1.62617C5.43456 1.32012 6.19289 1.16689 6.99984 1.1665C7.80678 1.1665 8.56511 1.31973 9.27484 1.62617C9.98456 1.93262 10.6019 2.34814 11.1269 2.87275C11.6519 3.39775 12.0676 4.01512 12.3741 4.72484C12.6805 5.43456 12.8336 6.19289 12.8332 6.99984C12.8332 7.80678 12.6799 8.56511 12.3735 9.27484C12.0671 9.98456 11.6515 10.6019 11.1269 11.1269C10.6019 11.6519 9.98456 12.0676 9.27484 12.3741C8.56511 12.6805 7.80678 12.8336 6.99984 12.8332Z" fill="#FF7700"/>
						 </svg>
					<p>2023-12-16</p>
			  </div>
			  <div class="nav__cart-container-boxes-box-content-data">
					<svg class="nav__cart-container-boxes-box-content-svgicon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
						 <path d="M7.00016 6.99984C7.321 6.99984 7.59575 6.8855 7.82441 6.65684C8.05308 6.42817 8.16722 6.15361 8.16683 5.83317C8.16683 5.51234 8.0525 5.23759 7.82383 5.00892C7.59516 4.78025 7.32061 4.66611 7.00016 4.6665C6.67933 4.6665 6.40458 4.78084 6.17591 5.0095C5.94725 5.23817 5.83311 5.51273 5.8335 5.83317C5.8335 6.154 5.94783 6.42875 6.1765 6.65742C6.40516 6.88609 6.67972 7.00023 7.00016 6.99984ZM7.00016 12.8332C5.43488 11.5012 4.26588 10.2642 3.49316 9.122C2.72044 7.97984 2.33388 6.92245 2.3335 5.94984C2.3335 4.4915 2.80269 3.3297 3.74108 2.46442C4.67947 1.59914 5.76583 1.1665 7.00016 1.1665C8.23488 1.1665 9.32144 1.59914 10.2598 2.46442C11.1982 3.3297 11.6672 4.4915 11.6668 5.94984C11.6668 6.92206 11.2803 7.97945 10.5072 9.122C9.73405 10.2646 8.56505 11.5016 7.00016 12.8332Z" fill="#FF7700"/>
						 </svg>
					<p>Warszawa</p>
			  </div>
			  <div class="nav__cart-container-boxes-box-content-data">
					<svg class="nav__cart-container-boxes-box-content-svgicon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
						 <path d="M7.00016 7.00016C6.3585 7.00016 5.80919 6.77169 5.35225 6.31475C4.8953 5.8578 4.66683 5.3085 4.66683 4.66683C4.66683 4.02516 4.8953 3.47586 5.35225 3.01891C5.80919 2.56197 6.3585 2.3335 7.00016 2.3335C7.64183 2.3335 8.19114 2.56197 8.64808 3.01891C9.10502 3.47586 9.3335 4.02516 9.3335 4.66683C9.3335 5.3085 9.10502 5.8578 8.64808 6.31475C8.19114 6.77169 7.64183 7.00016 7.00016 7.00016ZM2.3335 11.6668V10.0335C2.3335 9.70294 2.41866 9.39902 2.589 9.12175C2.75933 8.84447 2.98527 8.63311 3.26683 8.48766C3.86961 8.18627 4.48211 7.96013 5.10433 7.80925C5.72655 7.65836 6.3585 7.58311 7.00016 7.5835C7.64183 7.5835 8.27377 7.65894 8.896 7.80983C9.51822 7.96072 10.1307 8.18666 10.7335 8.48766C11.0154 8.6335 11.2416 8.84505 11.4119 9.12233C11.5822 9.39961 11.6672 9.70333 11.6668 10.0335V11.6668H2.3335Z" fill="#FF7700"/>
						 </svg>
					<p>Jacek Kowalski</p>
			  </div>
		 </div>
	</div>
	<div class="nav__cart-container-boxes-box-price">
		 <p class="nav__cart-container-boxes-box-price-delete">Usuń produkt</p>
		 <p class="nav__cart-container-boxes-box-price-sum">
			  <span class="nav__cart-container-boxes-box-price-sum-item">299zł /</span><span> 1szt.</span>
		 </p>
		 <form method="POST" action="">
			  <input name="_token" type="hidden" value="">
			  <input name="_method" type="hidden" value="PUT">
					<div class="nav__cart-container-boxes-box-price-form">
						 <div class="nav__cart-container-boxes-box-price-form-minus">
							  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
							  <path d="M14.25 9.74854H3.75V8.24854H14.25V9.74854Z" fill="#12263A"/>
							  </svg>
						 </div>
						 <input name="qty" type="text" value="1" data-current-value="1" class="nav__cart-container-boxes-box-price-form-input" aria-label="@lang('shop::global.items_qty')" data-hash="">
						 <div class="nav__cart-container-boxes-box-price-form-plus"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
							  <path d="M14.25 9.74854H9.75V14.2485H8.25V9.74854H3.75V8.24854H8.25V3.74854H9.75V8.24854H14.25V9.74854Z" fill="#12263A"/>
							  </svg></div>
					</div>
			  </form>
	</div>
	</div>`
	}

	const addToCartBtn = document.querySelectorAll('.add-to-cart-btn')

	addToCartBtn.forEach((btn) =>
		btn.addEventListener('click', () => {
			createCartElement()
		})
	)

	// API z kursami

	// const URL = 'http://127.0.0.1:8000/mini-cart'

	// fetch(URL)
	// .then(res => res.json())
	// .then(data => data)
	// .catch(err => console.error(err))







	// burger button ------------------------------------------

		const burgerBtn = document.querySelector('.jsBurger')
		const burgerBtnClose = document.querySelector('.jsCloseBurger')
		const btnBgc = document.querySelector('.nav__left-burgerBox')
		const mobileMenu = document.querySelector('.mobile-menu__first')
		const submenuMobileMenuBackBTN = document.querySelector('.mobile-menu__second-backBTN')
		const sumenuTrainingsBTN = document.querySelector('.jsTrainingsBTN')
		const showedTrainigsSubmenu = document.querySelector('.jsShowTrainingsSubmenu')


		const openBurgerBtn = () => {
			burgerBtn.classList.add('nav__account-burger-displaynone')
			burgerBtnClose.classList.add('nav__account-btnclose-displayblock')
			document.body.classList.add('no-scroll')
			btnBgc.classList.add('nav__left-burgerBox--bgcActive')
			mobileMenu.classList.add('mobile-menu__first--active')

			overlay.classList.add('overlay--active')

			overlay.addEventListener('click', () => {
				closeBurgerBtn()
			})
		}

		const closeBurgerBtn = () => {
			burgerBtn.classList.remove('nav__account-burger-displaynone')
			burgerBtnClose.classList.remove('nav__account-btnclose-displayblock')
			document.body.classList.remove('no-scroll')
			btnBgc.classList.remove('nav__left-burgerBox--bgcActive')
			mobileMenu.classList.remove('mobile-menu__first--active')

			overlay.classList.remove('overlay--active')
			showedTrainigsSubmenu.classList.remove('mobile-menu__second--active')
		}

		burgerBtn.addEventListener('click', () => {
			if (!burgerBtn.classList.contains('nav__account-burger-displaynone')) {
				openBurgerBtn()
			}
		})

		burgerBtnClose.addEventListener('click', () => {
				closeBurgerBtn()
		})

		sumenuTrainingsBTN.addEventListener('click', () => {
			showedTrainigsSubmenu.classList.add('mobile-menu__second--active')

		})

		submenuMobileMenuBackBTN.addEventListener('click', () => {
			showedTrainigsSubmenu.classList.remove('mobile-menu__second--active')

		})
		



	// THE END
})
