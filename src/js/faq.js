const faqQuestion = document.querySelectorAll('.faq__content__box__question')

faqQuestion.forEach(item => item.addEventListener('click', (e) => {
   // console.log(e.target);
   // console.log(e.target.nextElementSibling);


   if (e.target.firstElementChild) {

      if (!e.target.nextElementSibling.classList.contains('show')) {
         e.target.nextElementSibling.classList.add('show')
         e.target.firstElementChild.classList.add('rotate')
      } else if (e.target.nextElementSibling.classList.contains('show')) {
         e.target.nextElementSibling.classList.remove('show')
         e.target.firstElementChild.classList.remove('rotate')
      }

   }

}))