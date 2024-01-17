addEventListener('DOMContentLoaded', event => {
	const URL = window.location.origin
	let isEdit = false
	const alerts = document.querySelectorAll('.alert')
	if (alerts) {
		alerts.forEach(alert => {
			const deley = setTimeout(() => {
				alert.classList.add('alert__hide')
			}, 2000)
		})
	}

	const backdropActivate = overlay => {
		overlay.classList.add('overlay--active')
		document.body.classList.add('no-scroll')
	}

	const backdropDeActivate = overlay => {
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
			if (instructorForm) {
				handleClearForm(instructorForm)
			} else if (blogPostForm) {
				handleClearForm(blogPostForm)
			} else {
				handleClearForm(courseForm)
			}
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

	//
	const handleFillFromInputs = (form, data) => {
		Object.entries(data).forEach(([key, value]) => {
			let counter = 0
			const inputElement = form.querySelector(`[name='${key}']`)
			if (inputElement) {
				if (inputElement.tagName.toLowerCase() === 'select') {
					const niceSelect = inputElement.nextElementSibling
					const current = niceSelect.querySelector('.current')
					const listOptions = niceSelect.querySelectorAll('.option')
					const options = Array.from(inputElement.options)
					options.forEach((option, index) => {
						if (option.value == value) {
							listOptions[0].classList.remove('selected')
							listOptions[index].classList.add('selected')
							current.textContent = option.dataset.name
							option.selected = true
							// console.log(inputElement.selectedIndex)

							inputElement.addEventListener('change', e => {
								if (counter == 0) {
									listOptions[index].classList.remove('selected')
									counter++
								}
							})
						}
					})
				} else if (inputElement.type === 'checkbox') {
					inputElement.checked = value
				} else {
					inputElement.value = value
				}
			} else {
				console.log(`Brak pola formularza o nazwie '${key}'`)
			}
		})
	}
	//
	// Tworzenie wpisu

	//   tworzenie kursu
	///////////////////////////////////////////
	const courseForm = document.querySelector('.jsCourseForm')
	if (courseForm) {
		courseForm.addEventListener('submit', e => {
			e.preventDefault()
			const formData = new FormData(courseForm)
			const csrfToken = formData.get('csrfmiddlewaretoken')
			const fileInputs = courseForm.querySelectorAll('input[type="file"]')
			fileInputs.forEach(input => {
				const files = input.files
				for (let i = 0; i < files.length; i++) {
					const file = files[i]
					formData.append('uploaded_images', file)
				}
			})

			fetch(isEdit ? '/edit-course/' + courseId : '/account-courses', {
				method: isEdit ? 'PUT' : 'POST',
				headers: {
					'X-CSRFToken': csrfToken,
				},
				body: formData,
			})
				.then(response => {
					courseForm.reset()
					if (response.ok) {
						location.reload()
					} else {
						location.reload()
					}
				})
				.catch(error => {
					console.log(error)
				})

			// fetch('/account-courses', {
			// 	method: 'POST',
			// 	headers: {
			// 		'X-CSRFToken': csrfToken,
			// 	},
			// 	body: formData,
			// })
			// 	.then(response => {
			// 		console.log(response)
			// 		if (response.ok) {
			// 			location.reload()
			// 		} else {
			// 			location.reload()
			// 		}
			// 	})
			// 	.catch(error => {
			// 		console.log(error)
			// 	})
		})
	}

	const courseEditBtns = document.querySelectorAll('.jsCourseEdit')
	courseEditBtns.forEach(btn => {
		btn.addEventListener('click', e => {
			handleClearForm(courseForm)
			isEdit = true
			courseId = btn.dataset.id
			fetch('/edit-course/' + courseId, {
				method: 'GET',
			})
				.then(response => response.json())
				.then(data => {
					// console.log(data)
					const overlay = document.querySelector('.overlay')
					backdropActivate(overlay)
					drawer.classList.add('drawer--active')
					handleFillFromInputs(courseForm, data)
					if (data.images) {
						const imageElements = document.querySelector('.form__images').querySelectorAll('.form__images-image')
						if (imageElements) {
							for (let i = 0; i < data.images.length; i++) {
								imageElements[i].remove()
							}
						}
						data.images.reverse().forEach(image => {
							handleCreatePhoto(image.image)
						})

						const deleteElements = document.querySelectorAll('.form__images-delete')
						deleteElements.forEach(el => {
							el.addEventListener('click', e => {
								const elementToDelete = e.target.closest('.form__images-image')
								elementToDelete.remove()
								handleCreateInputFile('image')
							})
						})
					}
				})
		})
	})
	const blogPostForm = document.querySelector('.jsPostForm')
	const deletePostForms = document.querySelectorAll('.jsRemovePost')
	if (deletePostForms) {
		deletePostForms.forEach(form => {
			form.addEventListener('submit', e => {
				e.preventDefault()
				const formData = new FormData(form)
				const csrfToken = formData.get('csrfmiddlewaretoken')
				fetch(form.action, {
					method: 'DELETE',
					headers: {
						'X-CSRFToken': csrfToken,
					},
				})
					.then(response => {
						if (response.ok) {
							location.reload()
						} else {
							location.reload()
						}
					})
					.catch(error => {
						console.log(error)
					})
			})
		})
	}

	// edycja instruktora
	//   //////////////////////////////
	const instructorForm = document.querySelector('.jsInstructorForm')
	const handleImageNameDisplay = params => {
		const formImages = document.querySelectorAll('.form__images-image')
		if (formImages) {
			formImages.forEach(image => {
				image.addEventListener('change', e => {
					const input = image.querySelector('input')
					const fileNameSpan = image.querySelector('span')
					if (input.files.length > 0) {
						fileNameSpan.textContent = `${input.files[0].name}`
					} else {
						fileNameSpan.textContent = 'Wybierz zdjęcie'
					}
				})
			})
		}
	}

	const handleClearForm = form => {
		form.reset()
		const formImages = form.querySelectorAll('.form__images-image')
		formImages.forEach(el => {
			if (el.tagName.toLowerCase() === 'div') {
				el.remove()
				handleCreateInputFile()
			}
		})
	}

	const handleCreatePhoto = imageUrl => {
		const imagesContainer = document.querySelector('.form__images')

		const imageContainer = document.createElement('div')
		const deleteElement = document.createElement('div')
		const imageElement = document.createElement('img')
		imageContainer.classList.add('form__images-image')
		deleteElement.classList.add('form__images-delete')
		deleteElement.innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
				fill="none" stroke="white" stroke-width="2" stroke-linecap="round"
				stroke-linejoin="round" class="feather feather-x">
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			`
		imageElement.width = 150
		imageElement.height = 150
		imageElement.loading = 'lazy'
		imageElement.src = imageUrl

		const photoChangeInput = document.createElement('input')
		photoChangeInput.type = 'hidden'
		photoChangeInput.name = 'photo_change'
		// console.log(URL)
		// console.log(imageUrl)
		const resourcePath = imageUrl.replace(URL, '')
		photoChangeInput.value = resourcePath

		// const paresdUrl = new URL(imageUrl)
		// photoChangeInput.value = paresdUrl.pathname

		imagesContainer.insertBefore(imageContainer, imagesContainer.firstChild)
		imageContainer.appendChild(deleteElement)
		imageContainer.appendChild(imageElement)
		imageContainer.appendChild(photoChangeInput)
	}

	const handleCreateInputFile = type => {
		const imagesContainer = document.querySelector('.form__images')
		const imageContainer = document.createElement('label')
		const imagePlaceholder = document.createElement('span')
		const imageInput = document.createElement('input')
		imageContainer.classList.add('form__images-image')
		imagePlaceholder.textContent = 'Wybierz zdjęcie'
		imageInput.type = 'file'
		imageInput.name = type

		imagesContainer.appendChild(imageContainer)
		imageContainer.appendChild(imagePlaceholder)
		imageContainer.appendChild(imageInput)
		handleImageNameDisplay()
	}

	handleImageNameDisplay()

	const instructorEditBtns = document.querySelectorAll('.jsInstructorEdit')
	instructorEditBtns.forEach(btn => {
		btn.addEventListener('click', e => {
			handleClearForm(instructorForm)
			isEdit = true
			instructorId = btn.dataset.id
			fetch('/edit-instructor/' + instructorId, {
				method: 'GET',
			})
				.then(response => response.json())
				.then(data => {
					const overlay = document.querySelector('.overlay')
					backdropActivate(overlay)
					drawer.classList.add('drawer--active')
					instructorForm.querySelector("[name='first_name']").value = data.first_name
					instructorForm.querySelector("[name='last_name']").value = data.last_name
					instructorForm.querySelector("[name='description']").value = data.description
					if (data.photo) {
						const imageElements = document.querySelector('.form__images').querySelectorAll('.form__images-image')
						imageElements[0].remove()
						handleCreatePhoto(data.photo)

						const deleteElements = document.querySelectorAll('.form__images-delete')
						deleteElements.forEach(el => {
							el.addEventListener('click', e => {
								const elementToDelete = e.target.closest('.form__images-image')
								elementToDelete.remove()
								handleCreateInputFile('photo')
							})
						})
					}
				})
		})
	})

	if (instructorForm) {
		instructorForm.addEventListener('submit', e => {
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
				.then(response => {
					instructorForm.reset()
					if (response.ok) {
						location.reload()
					} else {
						location.reload()
					}
				})
				.catch(error => {
					console.log(error)
				})
		})
	}

	if (blogPostForm) {
		blogPostForm.addEventListener('submit', e => {
			e.preventDefault()
			const formData = new FormData(blogPostForm)
			const csrfToken = formData.get('csrfmiddlewaretoken')
			fetch(isEdit ? '/account-blog/' + blogPostId : '/account-blog', {
				method: isEdit ? 'PUT' : 'POST',
				headers: {
					'X-CSRFToken': csrfToken,
				},
				body: formData,
			})
				.then(response => {
					blogPostForm.reset()
					if (response.ok) {
						location.reload()
					} else {
						location.reload()
					}
				})
				.catch(error => {
					console.log(error)
				})
		})
	}

	const setCheckedInput = (data, form) => {
		if (data.categories.length > 0) {
			data.categories.forEach(category => {
				const inputToCheck = form.querySelector(`#category_${category.id}`)
				if (inputToCheck) {
					inputToCheck.checked = true
				}
			})
		}
	}

	const blogPostEditBtns = document.querySelectorAll('.jsPostEdit')
	blogPostEditBtns.forEach(btn => {
		btn.addEventListener('click', e => {
			handleClearForm(blogPostForm)
			isEdit = true
			blogPostId = btn.dataset.id
			fetch('/account-blog/' + blogPostId, {
				method: 'GET',
			})
				.then(response => response.json())
				.then(data => {
					setCheckedInput(data, blogPostForm)
					const overlay = document.querySelector('.overlay')
					backdropActivate(overlay)
					drawer.classList.add('drawer--active')
					blogPostForm.querySelector("[name='title']").value = data.title
					blogPostForm.querySelector("[name='short_content']").value = data.short_content
					blogPostForm.querySelector("[name='content']").value = data.content
					if (data.photo) {
						const imageElements = document.querySelector('.form__images').querySelectorAll('.form__images-image')
						imageElements[0].remove()
						handleCreatePhoto(data.photo)

						const deleteElements = document.querySelectorAll('.form__images-delete')
						deleteElements.forEach(el => {
							el.addEventListener('click', e => {
								const elementToDelete = e.target.closest('.form__images-image')
								elementToDelete.remove()
								handleCreateInputFile('photo')
							})
						})
					}
				})
		})
	})

	const showCartIcon = document.querySelector('.nav__right-basket')
	const drawerCart = document.querySelector('.nav__cart')
	const overlay = document.querySelector('.overlay')

	const showCart = () => {
		drawerCart.classList.add('nav__cart-showcart')
		backdropActivate(overlay)
	}

	const closeCart = () => {
		const closeCartIcon = document.querySelector('.nav__cart-head-closebtn')
		closeCartIcon.addEventListener('click', () => {
			drawerCart.classList.remove('nav__cart-showcart')
			backdropDeActivate(overlay)
		})
	}

	if (showCartIcon) {
		showCartIcon.addEventListener('click', () => {
			showCart()
			closeCart()
		})
	}

	const overlayElement = document.querySelectorAll('.overlay ')
	overlayElement.forEach(over =>
		over.addEventListener('click', () => {
			drawerCart.classList.remove('nav__cart-showcart')
			backdropDeActivate(overlay)
			drawer.classList.remove('drawer--active')
			backdropDeActivate(overlay)
		})
	)

	const getCSRFToken = () => {
		const cookies = document.cookie.split(';')
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].trim()
			if (cookie.startsWith('csrftoken=')) {
				return cookie.split('=')[1]
			}
		}
		return null // Token CSRF nie znaleziony
	}
	const csrfTokenCookie = getCSRFToken()
	// ---------------------------------------------------------------------------------------------------

	const handleDeleteFormCart = () => {
		const deleteCartItemForms = document.querySelectorAll('.jsDeleteCartItem')
		if (deleteCartItemForms) {
			deleteCartItemForms.forEach(form => {
				form.addEventListener('submit', e => {
					e.preventDefault()
					fetch(form.action, {
						method: 'DELETE',
						headers: {
							'X-CSRFToken': csrfTokenCookie,
						},
					}).then(response => {
						if (response.ok) {
							response.json().then(data => {
								createMiniCart(data)
								totalPriceCart(data)
								handleDeleteFormCart()
								handleQuantity(data)
							})
						}
					})
				})
			})
		}
	}
	const hanldeAddToCart = params => {
		const addToCartElement = document.querySelector('.jsAddToCart')
		if (addToCartElement) {
			addToCartElement.addEventListener('submit', e => {
				e.preventDefault()
				const formData = new FormData(addToCartElement)
				const csrfToken = formData.get('csrfmiddlewaretoken')
				fetch(addToCartElement.action, {
					method: 'POST',
					headers: {
						'X-CSRFToken': csrfToken,
					},
					body: formData,
				}).then(response => {
					if (response.ok) {
						// console.log(response)
						getMiniCartData()
						showCart()
						closeCart()
						// response.json().then((data) => {
						// 	createMiniCart(data)
						// })
					}
				})
			})
		}
	}

	const updateQuantity = form => {
		const formData = new FormData(form)
		fetch(form.action, {
			method: 'PATCH',
			headers: {
				'X-CSRFToken': csrfTokenCookie,
			},
			body: formData,
		}).then(response => {
			if (response.ok) {
				response.json().then(data => {
					createMiniCart(data)
					totalPriceCart(data)
					handleDeleteFormCart()
					handleQuantity()
				})
			}
		})
	}

	const addQuantityToForm = form => {
		const cartInputPlus = form.querySelector('.nav__cart-container-boxes-box-price-form-plus')
		const cartInputMinus = form.querySelector('.nav__cart-container-boxes-box-price-form-minus')
		let cartInputValue = form.querySelector('#jsCartInput')

		let previousValue = cartInputValue.value
		let maxSets = parseInt(cartInputValue.dataset.maxQty)

		cartInputValue.addEventListener('input', () => {
			const currentInputValue = cartInputValue.value
			if (/^\d*$/.test(currentInputValue) && currentInputValue > 0 && currentInputValue <= maxSets) {
				previousValue = currentInputValue
				updateQuantity(form)
			} else {
				cartInputValue.value = previousValue
			}
		})

		cartInputPlus.addEventListener('click', () => {
			let quantityOfOrder = cartInputValue.getAttribute('data-max-qty')
			quantityOfOrder -= 1

			if (cartInputValue.value <= quantityOfOrder) {
				cartInputValue.value++
				updateQuantity(form)
			}
		})

		cartInputMinus.addEventListener('click', () => {
			if (cartInputValue.value >= 2) {
				cartInputValue.value--
				updateQuantity(form)
			}
		})
	}

	const handleQuantity = params => {
		const quantityForms = document.querySelectorAll('.jsQuantity')
		if (quantityForms) {
			quantityForms.forEach(form => {
				addQuantityToForm(form)
			})
		}
	}

	const getInstructorFullName = payload => {
		return `${payload.first_name} ${payload.last_name}`
	}

	const createMiniCart = payload => {
		const cartElement = document.querySelector('.jsCartBody')
		const navCartContainer = document.querySelector('.nav__cart-container')
		const cartFooterElement = document.querySelector('.nav__cart-container-footer')

		if (cartElement) {
			cartElement.innerHTML = ''
			const cartItems = payload.items

			if (cartItems.length > 0) {
				navCartContainer.classList.remove('nav__cart-container--empty')
				const jsAddGoToCheckoutBtn = document.querySelector('.jsAddGoToCheckoutBtn')
				jsAddGoToCheckoutBtn.innerHTML = `
				<div class="nav__cart-container-footer-line"></div>
        		<div class="nav__cart-container-footer-sum">
            <p class="nav__cart-container-footer-sum-text">Wartość koszyka</p>
            <p class="nav__cart-container-footer-sum-text-price"><span class="jsSumPrice">0,00</span> zł</p>
        		</div>
        		<a title="Poznaj oferte" href="${URL}/cart" class="btn btn--primary nav__cart-container-footer-btn">Do kasy
            <span class="btn__arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 20L10.575 18.6L16.175 13H4V11H16.175L10.575 5.4L12 4L20 12L12 20Z" fill="white" />
                </svg>
            </span>
        		</a>`
				cartItems.forEach(cartItem => {
					const cartItemElement = document.createElement('div')
					const instructorFullName = getInstructorFullName(cartItem.instructor)

					// console.log(cartItem.course.seats);

					cartItemElement.classList.add('nav__cart-container-boxes-box')
					cartItemElement.innerHTML = `
					<img class="nav__cart-container-boxes-box-img" src="${cartItem.images.image_thumb}">
					<div class="nav__cart-container-boxes-box-content">
						<p class="nav__cart-container-boxes-box-content-title">${cartItem.course.title}</p>
						<div>
							<div class="nav__cart-container-boxes-box-content-data">
								<svg class="nav__cart-container-boxes-box-content-svgicon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
									<path d="M8.48734 9.654L9.304 8.82275L7.58317 7.10192V4.6665H6.4165V7.58317L8.48734 9.654ZM6.4165 3.49984H7.58317V2.33317H6.4165V3.49984ZM10.4998 7.58317H11.6665V6.4165H10.4998V7.58317ZM6.4165 11.6665H7.58317V10.4998H6.4165V11.6665ZM2.33317 7.58317H3.49984V6.4165H2.33317V7.58317ZM6.99984 12.8332C6.19289 12.8332 5.43456 12.6799 4.72484 12.3735C4.01512 12.0671 3.39775 11.6515 2.87275 11.1269C2.34775 10.6019 1.93223 9.98456 1.62617 9.27484C1.32012 8.56511 1.16689 7.80678 1.1665 6.99984C1.1665 6.19289 1.31973 5.43456 1.62617 4.72484C1.93262 4.01512 2.34814 3.39775 2.87275 2.87275C3.39775 2.34775 4.01512 1.93223 4.72484 1.62617C5.43456 1.32012 6.19289 1.16689 6.99984 1.1665C7.80678 1.1665 8.56511 1.31973 9.27484 1.62617C9.98456 1.93262 10.6019 2.34814 11.1269 2.87275C11.6519 3.39775 12.0676 4.01512 12.3741 4.72484C12.6805 5.43456 12.8336 6.19289 12.8332 6.99984C12.8332 7.80678 12.6799 8.56511 12.3735 9.27484C12.0671 9.98456 11.6515 10.6019 11.1269 11.1269C10.6019 11.6519 9.98456 12.0676 9.27484 12.3741C8.56511 12.6805 7.80678 12.8336 6.99984 12.8332Z" fill="#FF7700"/>
									</svg>
								<p>${cartItem.course.date}</p>
							</div>
							<div class="nav__cart-container-boxes-box-content-data">
								<svg class="nav__cart-container-boxes-box-content-svgicon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
									<path d="M7.00016 6.99984C7.321 6.99984 7.59575 6.8855 7.82441 6.65684C8.05308 6.42817 8.16722 6.15361 8.16683 5.83317C8.16683 5.51234 8.0525 5.23759 7.82383 5.00892C7.59516 4.78025 7.32061 4.66611 7.00016 4.6665C6.67933 4.6665 6.40458 4.78084 6.17591 5.0095C5.94725 5.23817 5.83311 5.51273 5.8335 5.83317C5.8335 6.154 5.94783 6.42875 6.1765 6.65742C6.40516 6.88609 6.67972 7.00023 7.00016 6.99984ZM7.00016 12.8332C5.43488 11.5012 4.26588 10.2642 3.49316 9.122C2.72044 7.97984 2.33388 6.92245 2.3335 5.94984C2.3335 4.4915 2.80269 3.3297 3.74108 2.46442C4.67947 1.59914 5.76583 1.1665 7.00016 1.1665C8.23488 1.1665 9.32144 1.59914 10.2598 2.46442C11.1982 3.3297 11.6672 4.4915 11.6668 5.94984C11.6668 6.92206 11.2803 7.97945 10.5072 9.122C9.73405 10.2646 8.56505 11.5016 7.00016 12.8332Z" fill="#FF7700"/>
									</svg>
								<p>${cartItem.course.city}</p>
							</div>
							<div class="nav__cart-container-boxes-box-content-data">
								<svg class="nav__cart-container-boxes-box-content-svgicon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
									<path d="M7.00016 7.00016C6.3585 7.00016 5.80919 6.77169 5.35225 6.31475C4.8953 5.8578 4.66683 5.3085 4.66683 4.66683C4.66683 4.02516 4.8953 3.47586 5.35225 3.01891C5.80919 2.56197 6.3585 2.3335 7.00016 2.3335C7.64183 2.3335 8.19114 2.56197 8.64808 3.01891C9.10502 3.47586 9.3335 4.02516 9.3335 4.66683C9.3335 5.3085 9.10502 5.8578 8.64808 6.31475C8.19114 6.77169 7.64183 7.00016 7.00016 7.00016ZM2.3335 11.6668V10.0335C2.3335 9.70294 2.41866 9.39902 2.589 9.12175C2.75933 8.84447 2.98527 8.63311 3.26683 8.48766C3.86961 8.18627 4.48211 7.96013 5.10433 7.80925C5.72655 7.65836 6.3585 7.58311 7.00016 7.5835C7.64183 7.5835 8.27377 7.65894 8.896 7.80983C9.51822 7.96072 10.1307 8.18666 10.7335 8.48766C11.0154 8.6335 11.2416 8.84505 11.4119 9.12233C11.5822 9.39961 11.6672 9.70333 11.6668 10.0335V11.6668H2.3335Z" fill="#FF7700"/>
									</svg>
								<p>${instructorFullName}</p>
							</div>
						</div>
					</div>
					<div class="nav__cart-container-boxes-box-price">
	
	
					<form class="jsDeleteCartItem" method="DELETE" action="${URL}/cart/remove/${cartItem.cartItemId}/">
					<button  class="nav__cart-container-boxes-box-price-delete">Usuń produkt</button>
					</form>
				
	
	
					<p class="nav__cart-container-boxes-box-price-sum">
						<span class="nav__cart-container-boxes-box-price-sum-item">${cartItem.course.price} /</span><span> 1szt.</span>
					</p>
					
	
	
					<form class="jsQuantity" method="PATCH" action="${URL}/cart/increase-quantity/${cartItem.cartItemId}">
						<div class="nav__cart-container-boxes-box-price-form">
							<div class="nav__cart-container-boxes-box-price-form-minus">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M14.25 9.74854H3.75V8.24854H14.25V9.74854Z" fill="#12263A"/>
								</svg>
							</div>
	
							<input id="jsCartInput" data-max-qty="${cartItem.course.seats}" name="quantity" type="text" value="${cartItem.quantity}" class="nav__cart-container-boxes-box-price-form-input">
	
							<div class="nav__cart-container-boxes-box-price-form-plus">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M14.25 9.74854H9.75V14.2485H8.25V9.74854H3.75V8.24854H8.25V3.74854H9.75V8.24854H14.25V9.74854Z" fill="#12263A"/>
								</svg>
							</div>
						</div>
					</form>
				</div>
					`
					cartElement.appendChild(cartItemElement)
				})

				cartIconNumberOfOrders(cartItems.length)
			} else {
				cartFooterElement.innerHTML = ''
				navCartContainer.classList.add('nav__cart-container--empty')

				cartElement.innerHTML = `<div class="nav__cart-container-boxes-empty-cart">

				<svg width="80" height="80" viewBox="0 0 118 118" fill="none"
					 xmlns="http://www.w3.org/2000/svg">
					 <path
						  d="M117.438 111.438L6.56167 0.561523L0 7.12319L22.6817 29.8049L34.1 53.8815L27.125 66.5399C26.2983 67.9865 25.8333 69.6915 25.8333 71.4999C25.8333 74.2404 26.922 76.8687 28.8599 78.8066C30.7978 80.7445 33.4261 81.8332 36.1667 81.8332H74.71L81.84 88.9632C79.2567 90.8232 77.5 93.8715 77.5 97.3332C77.5 100.074 78.5887 102.702 80.5266 104.64C82.4644 106.578 85.0928 107.667 87.8333 107.667C91.295 107.667 94.3433 105.962 96.2033 103.327L110.877 118L117.438 111.438ZM38.3367 71.4999C37.9941 71.4999 37.6656 71.3638 37.4233 71.1215C37.1811 70.8793 37.045 70.5508 37.045 70.2082L37.2 69.5882L41.85 61.1665H54.0433L64.3767 71.4999H38.3367ZM80.3417 61.1665C84.2167 61.1665 87.6267 59.0482 89.3833 55.8449L107.88 22.4165C108.293 21.5899 108.5 20.7115 108.5 19.8332C108.5 18.4629 107.956 17.1487 106.987 16.1798C106.018 15.2109 104.704 14.6665 103.333 14.6665H33.79L80.3417 61.1665ZM36.1667 86.9999C33.4261 86.9999 30.7978 88.0885 28.8599 90.0264C26.922 91.9643 25.8333 94.5926 25.8333 97.3332C25.8333 100.074 26.922 102.702 28.8599 104.64C30.7978 106.578 33.4261 107.667 36.1667 107.667C38.9072 107.667 41.5356 106.578 43.4734 104.64C45.4113 102.702 46.5 100.074 46.5 97.3332C46.5 94.5926 45.4113 91.9643 43.4734 90.0264C41.5356 88.0885 38.9072 86.9999 36.1667 86.9999Z"
						  fill="#FFAD66" />
				</svg>

				<p class="nav__cart-container-boxes-empty-cart-text">Koszyk jest pusty</p>

				<a title="Do sklepu" href="${URL}"
					 class="btn btn--primary nav__cart-container-footer-btn">Do sklepu
					 <span class="btn__arrow">
						  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M12 20L10.575 18.6L16.175 13H4V11H16.175L10.575 5.4L12 4L20 12L12 20Z"
									 fill="white" />
						  </svg>
					 </span>
				</a>
		  </div>`
				cartIconNumberOfOrders(cartItems.length)
			}
		}
	}

	const totalPriceCart = data => {
		const sumOfPriceCromCart = document.querySelector('.jsSumPrice')
		if (sumOfPriceCromCart) {
			sumOfPriceCromCart.innerHTML = data.total_price
		}
	}

	const cartIconNumberOfOrders = data => {
		const ordersCount = parseInt(data)
		const dot = document.querySelector('.nav__right-cart-icon')
		if (dot) {
			if (ordersCount == 0) {
				dot.classList.remove('nav__right-cart-icon-show')
			} else if (ordersCount >= 1) {
				dot.classList.add('nav__right-cart-icon-show')
				// console.log(ordersCount)
				dot.innerHTML = `<p class="nav__right-cart-icon-number">${ordersCount}</p>`
			}
		}

		// const hideCartIconNumberOfOrders = () => {

		// 	const changeSetQuantity = document.querySelector('.nav__right-cart-icon-number')
		// 	let quantity = ordersCount

		// 	if (quantity <= 1) {
		// 		dot.classList.remove('nav__right-cart-icon-show')
		// 		--quantity
		// 		changeSetQuantity.textContent = `${quantity}`
		// 	} else {
		// 		--quantity
		// 		changeSetQuantity.textContent = `${quantity}`
		// 	}
		// }

		// const changeIconOrdersNumber = document.querySelectorAll('.jsDeleteCartItem')
		// changeIconOrdersNumber.forEach((item) => {
		// 	item.addEventListener('click', hideCartIconNumberOfOrders)
		// })
	}

	const getMiniCartData = () => {
		fetch(`${URL}/mini-cart`, {
			method: 'GET',
			headers: {
				'X-CSRFToken': csrfTokenCookie,
			},
		}).then(response => {
			if (response.ok) {
				response.json().then(data => {
					createMiniCart(data)
					totalPriceCart(data)
					// cartIconNumberOfOrders(data)
					handleQuantity()
					handleDeleteFormCart()
				})
			}
		})
	}

	getMiniCartData()
	hanldeAddToCart()

	// Karty strona glowna
	const provinceLabel = document.querySelector('.jsLabelList')

	const provinceLabels = item => {
		console.log(item)

		const labelElement = document.createElement('li')
		labelElement.classList.add('splide__slide', 'offert__nav', 'jsLabel', 'offert__jsLabel')
		labelElement.innerHTML = item

		provinceLabel.append(labelElement)
	}

	const getProvinces = () => {
		fetch(`${URL}/active-provinces`, {
			method: 'GET',
			headers: {
				'X-CSRFToken': csrfTokenCookie,
			},
		}).then(response => {
			if (response.ok) {
				response.json().then(data => {
					if (provinceLabel) {
						provinceLabel.innerHTML = ''

						for (let i = 0; i < data.length; i++) {
							let provincesElements = data[i].province_name

							if (provincesElements) {
								provinceLabels(provincesElements)
							}
						}
						// getProvinceCourses(provinceItem)
						// Musisz tutaj js narysować te zakładki z wojewodztwami (funkcja + foreach)
					}
				})
			}
		})
	}

	const getProvinceCourses = data => {
		// console.log(data)

		fetch(`${URL}/courses-by-province/${data}`, {
			method: 'GET',
			headers: {
				'X-CSRFToken': csrfTokenCookie,
			},
		}).then(response => {
			if (response.ok) {
				response.json().then(data => {
					// console.log(data)
					// Tutaj funkcja ktora dostanie dane i wyrysuje karty produktowe
					// Jak skonczysz je dodawac to musisz odaplic funkcje ze splide
				})
			}
		})
	}

	const activeProvinceSlider = () => {
		const offert = document.querySelector('.offert-carousel')
		if (offert) {
			const offertCarousel = new Splide(offert, {
				// type: 'loop',
				// perPage: 2,
				fixedWidth: '440',
				gap: 36,
				arrows: false,
				pagination: true,
			})

			offertCarousel.mount()
		}
	}

	getProvinces()
	activeProvinceSlider()

	// STRIPE
	const checkoutForm = document.querySelector('.jsCreateCheckout')
	if (checkoutForm) {
		checkoutForm.addEventListener('submit', e => {
			// WALIDAJCA
			// Utworzenie obiektu z danymi fromData

			const formData = {
				// user: 2,
				// user_data: [
				// 	{
				// 		name: 'Adam',
				// 		surname: 'Testowy',
				// 		email: 'adam.testowy@example.com',
				// 		phone: '899789987',
				// 	},
				// ],
				name: 'Jan',
				surname: 'Kowalski',
				email: 'jan.kowalski@example.com',
				phone: '123456789',
				purchased_courses: [
					{
						course: 47,
						quantity: 2,
						participants: [
							{
								name: 'Jan',
								surname: 'Kowalski',
								email: 'jan.kowalski@example.com',
								phone: '123456789',
							},
							{
								name: 'Anna',
								surname: 'Nowak',
								email: 'anna.nowak@example.com',
								phone: '987654321',
							},
						],
					},
					{
						course: 30,
						quantity: 1,
						participants: [
							{
								name: 'Karolina',
								surname: 'Wiśniewska',
								email: 'karolina.wisniewska@example.com',
								phone: '111222333',
							},
						],
					},
				],
			}

			e.preventDefault()
			var stripe = Stripe(
				'pk_test_51O2IdAKiNvxN6rGZ2WJiJgSld6y86ePUmmhIHe3CjSSLTYYuJ7M16NFgByVzI5RhXJ1xdAjtQqeodyJ8NeFulAri00klwONrWu'
			)

			fetch('/create-checkout-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfTokenCookie,
				},
				body: JSON.stringify(formData),
			})
				.then(function (response) {
					return response.json()
				})
				.then(function (session) {
					return stripe.redirectToCheckout({ sessionId: session.id })
				})
				.then(function (result) {
					if (result.error) {
						console.error(result.error.message)
					}
				})
		})
	}


   // burger button ------------------------------------------

		const burgerBtn = document.querySelector('.jsBurger')
		const burgerBtnClose = document.querySelector('.jsCloseBurger')
		const btnBgc = document.querySelector('.nav__left-burgerBox')
		const mobileMenu = document.querySelector('.mobile-menu__first')


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
		}

		burgerBtn.addEventListener('click', () => {
			if (!burgerBtn.classList.contains('nav__account-burger-displaynone')) {
				openBurgerBtn()
			}
		})

		burgerBtnClose.addEventListener('click', () => {
				closeBurgerBtn()
		})




	// THE END
})