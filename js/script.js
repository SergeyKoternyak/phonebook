$(function(){
// Фото загруженно (стиль)
	function haveFile (){
		$('input[type="file"]').change(function(){
			if(this.files.length){
				$(this).parent('.upload').addClass('have-file');
				$(this).prev().text('Uploaded')
			} else {
				$(this).parent('.upload').removeClass('have-file')
				$(this).prev().text('Load photo')
			}
		})
	};
	haveFile();

// Подключение календаря
	$(".birthday").dateDropper({
		format:"Y-m-d",
		lang:"ru",
		color:"#79C7ED",
		boxShadow:"0 0px 0px 0px rgba(0,0,0,0.0)",
		borderColor:"#A9A9A9",
		bgColor:"#E6E6E6",
		textColor:"#A9A9A9"
	});

// Маска ввода
	$(function($){
		$('.mobile, .home, .work').mask("+99 (999) 999-99-99", {placeholder:"*"})
	});

// Скрытие пустых полей
	function emptyFields (num){
		var organization = $('li.full-view:nth-child('+(num+1)+')').find('.organization');
		var organizationVal = organization.text();
		organization.css({display : 'none'});
		if(organizationVal.length > 0){
			organization.css({display : 'block'})
		};

		var mobileDesc = $('li.full-view:nth-child('+(num+1)+')').find('.mobile .description');
		var mobileVal = mobileDesc.text();
		var mobile = mobileDesc.parent('.mobile');
		mobile.css({display : 'none'});
		if(mobileVal.length > 0){
			mobile.css({display : 'block'})
		};

		var homeDesc = $('li.full-view:nth-child('+(num+1)+')').find('.home .description');
		var homeVal = homeDesc.text();
		var home = homeDesc.parent('.home');
		home.css({display : 'none'});
		if(homeVal.length > 0){
			home.css({display : 'block'})
		};

		var workDesc = $('li.full-view:nth-child('+(num+1)+')').find('.work .description');
		var workVal = workDesc.text();
		var work = workDesc.parent('.work');
		work.css({display : 'none'});
		if(workVal.length > 0){
			work.css({display : 'block'})
		};

		var emailDesc = $('li.full-view:nth-child('+(num+1)+')').find('.email .description');
		var emailVal = emailDesc.text();
		var email = emailDesc.parent('.email');
		email.css({display : 'none'});
		if(emailVal.length > 15){
			email.css({display : 'block'})
		};

		var adressDesc = $('li.full-view:nth-child('+(num+1)+')').find('.adress .description');
		var adressVal = adressDesc.text();
		var adress = adressDesc.parent('.adress');
		adress.css({display : 'none'});
		if(adressVal.length > 0){
			adress.css({display : 'block'})
		};

		var birthdayDesc = $('li.full-view:nth-child('+(num+1)+')').find('.birthday .description');
		var birthdayVal = birthdayDesc.text();
		var birthday = birthdayDesc.parent('.birthday');
		birthday.css({display : 'none'});
		if(birthdayVal.length > 0){
			birthday.css({display : 'block'})
		};
	};

// Переменные и массивы
	var saveNotes = [];

	var NowMoment = moment();
	var nowData = NowMoment.format('MM-DD');

	var template = $('#template').html();
	var compiled = _.template(template);
	var templateSecond = $('#template-second').html();
	var compiledSecond = _.template(templateSecond);

// Проверка localStorage 
	if(localStorage.saveNotes){
		saveNotes = JSON.parse(localStorage.saveNotes);
		saveNotes.forEach(function(item, i){
			if(item){
				render(item, i);
			}
		});
	};

// Проверка дня рождения
	function todayBirthday(saveNotes,nowData) {
		for(i=0; i<saveNotes.length; i++){
			if(saveNotes[i].birthday.slice(5,11) === nowData) {
				$('li.compact-view').eq(i).find('.birthday-logo').css({display :'block'});
			}
		}
	};
	todayBirthday(saveNotes, nowData);

// Подсчет контактов
	function contactCount (){
		$('.head').text('Amount of contacts - ' + saveNotes.length);
	};
	contactCount();

// Вставка шаблона
	function render(note, num){
		var compactElement = compiled({
			fullName: [note.lastName, note.firstName, note.patronymic].join(' '),
			num: num
		});

		var newElement = compiledSecond({
			fullName: [note.lastName, note.firstName, note.patronymic].join(' '),
			organization: note.organization,
			mobile: note.mobile,
			home: note.home,
			work: note.work,
			email: note.email,
			adress: note.adress,
			birthday: note.birthday,
			photo: note.photo,
			num: num
		});

		$('ul.compact-view').append(compactElement);
		$('ul.full-view').append(newElement);
	};

// Сохранение в localStorage
	function save(){
		localStorage.setItem('saveNotes', JSON.stringify(saveNotes));
	};

// *********** События ***********

// Открытие/закрытие блокнота
	$('.open-book').click(function(){
		$('.left-side').css({transform : 'rotateY(-180deg)'});
		$('.container').animate({left : 0}, 2000);
	});

	$('.bookmark').click(function(){
		$('.left-side').css({transform : 'rotateY(0deg)'});
		$('.container').animate({left : -200}, 2000);
	});

// Появление/скрытие окна добавления нового контакта
	function addNewHide (){
		$('.add-new-wrap').animate({opacity : '0'}, 1000, function(){
			$('.add-new-wrap').css({display : 'none'});
		});
	};

	$('.add').click(function(){
		$('.add-new-wrap').css({display : 'block'}).animate({opacity : '1'}, 1000);
	});
	$('.close').click(function(){
		addNewHide ();
	});

// Сохранение нового контакта
	$('.save').click(function(){
		if(($('.first-name').val().length > 0 || $('.last-name').val().length > 0) && ( $('.mobile').val().length > 0 || $('.home').val().length > 0 || $('.work').val().length > 0 )){
			var fileInput = document.querySelector(".photo");
			var files = fileInput.files;
			if(files.length){
				var file = files[0];
				size = file.size;
				if (files && file && size < 200*1024) {
					 var reader = new FileReader();
					reader.onload = function(readerEvt) {
						var binaryString = readerEvt.target.result;
						createNew( btoa(binaryString) );
					};
					reader.readAsBinaryString(file);
				} else {
					alert ('The size of photo exceeds 200Kb')
				}
			} else {
				createNew('');
			};

			function createNew(img){
				var note = {
					firstName: $('.first-name').val(),
					lastName: $('.last-name').val(),
					patronymic: $('.patronymic').val(),
					organization: $('.organization').val(),
					mobile: $('.mobile').val(),
					home: $('.home').val(),
					work: $('.work').val(),
					email: $('.email').val(),
					adress: $('.adress').val(),
					birthday: $('.birthday').val(),
					photo: 'data:image/jpeg;base64, '+img
				};
				if(note.photo === 'data:image/jpeg;base64, '){
					note.photo = 'styles/imgs/nobody.png'
				};
				saveNotes.push(note);
				var num = saveNotes.length-1;
				render(note, num);
				todayBirthday(saveNotes, nowData);
				save();
				contactCount();
				$('.first-name, .last-name, .patronymic, .organization, .mobile, .home, .work, .email, .adress, .birthday, .photo').val('');
				$('li.compact-view').css({borderBottom : 'none'}).last().css({borderBottom : '1px solid grey'});
				addNewHide();
			};
		} else {
			alert ('Enter the name or surname and telephone')
		};
	});

// Удаление контакта
	$('ul.full-view').on('click', '.remove', function(){
		var note = $(this).closest('li.full-view');
		num = $(note).index();
		$(this).closest('.container').find('li.compact-view').eq(num).remove();
		note.remove();
		saveNotes.splice(num, 1);
		$('li.compact-view').css({borderBottom : 'none'}).last().css({borderBottom : '1px solid grey'});
		hasNote = false;
		saveNotes.forEach(function(item){
			if(item){
				hasNote = true;
			}
		});
		if(!hasNote){
			saveNotes = [];
		}
		save();
		contactCount();
	})

// Редактирование контакта
	.on('click', '.edit', function(){
		haveFile();
		var noteReady = $(this).parent('.ready-note');
		var noteEdit = noteReady.next('.edit-note');
		var num = $(this).closest('li.full-view').data('num');
		num = parseInt(num);
		var a = noteEdit.find('.last-name-edit').val(saveNotes[num].lastName);
		var b = noteEdit.find('.first-name-edit').val(saveNotes[num].firstName);
		var c = noteEdit.find('.patronymic-edit').val(saveNotes[num].patronymic);
		var d = noteEdit.find('.organization-edit').val(saveNotes[num].organization);
		var e = noteEdit.find('.mobile-edit').val(saveNotes[num].mobile);
		var f = noteEdit.find('.home-edit').val(saveNotes[num].home);
		var g = noteEdit.find('.work-edit').val(saveNotes[num].work);
		var h = noteEdit.find('.email-edit').val(saveNotes[num].email);
		var i = noteEdit.find('.adress-edit').val(saveNotes[num].adress);
		var j = noteEdit.find('.birthday-edit').val(saveNotes[num].birthday);
	// Подключение календаря
		$(".birthday-edit").dateDropper({
			format:"Y-m-d",
			lang:"ru",
			color:"#79C7ED",
			boxShadow:"0 0px 0px 0px rgba(0,0,0,0.0)",
			borderColor:"#A9A9A9",
			bgColor:"#E6E6E6",
			textColor:"#A9A9A9"
		});
		$(function($){
			$('.mobile-edit, .home-edit, .work-edit').mask("+99 (999) 999-99-99",{placeholder:"*"})
		});
		noteReady.toggle();
		noteEdit.toggle();
	})

// Сохранение редактирования
	.on('click', '.save-edit', function(){

		var noteEdit = $(this).closest('.edit-note');
		var noteReady = $(this).closest('.edit-note').prev('.ready-note');
		var num = $(this).closest('li.full-view').data('num');
		num = parseInt(num);

		var fileInput = noteEdit[0].querySelector(".photo");
		var files = fileInput.files;

		var a = noteEdit.find('.last-name-edit').val();
		var b = noteEdit.find('.first-name-edit').val();
		var c = noteEdit.find('.patronymic-edit').val();
		var d = noteEdit.find('.organization-edit').val();
		var e = noteEdit.find('.mobile-edit').val();
		var f = noteEdit.find('.home-edit').val();
		var g = noteEdit.find('.work-edit').val();
		var h = noteEdit.find('.email-edit').val();
		var i = noteEdit.find('.adress-edit').val();
		var j = noteEdit.find('.birthday-edit').val();

		if(files.length){
			var file = files[0];
			size = file.size;
			if (files && file && size < 200*1024) {
				 var reader = new FileReader();
				reader.onload = function(readerEvt) {
					var binaryString = readerEvt.target.result;
					saveItem( btoa(binaryString) );
				};
				reader.readAsBinaryString(file);
			} else {
				alert ('The size of photo exceeds 200Kb')
			}
		} else {
			saveItem('');
		};

		function saveItem(img) {
			if((a.length > 0 || b.length > 0) && (e.length > 0 || f.length > 0 || g.length > 0 )){
				saveNotes[num].lastName = a;
				saveNotes[num].firstName = b;
				saveNotes[num].patronymic = c;
				saveNotes[num].organization = d;
				saveNotes[num].mobile = e;
				saveNotes[num].home = f;
				saveNotes[num].work = g;
				saveNotes[num].email = h;
				saveNotes[num].adress = i;
				saveNotes[num].birthday = j;
				if(img){
					saveNotes[num].photo = 'data:image/jpeg;base64, '+img;
				}
			} else {
				alert ('Enter the name or surname and telephone')
			};

			$('li').remove();
			saveNotes.forEach(function(item, i){
				if(item){
					render(item, i);
				}
			});

			$('li.compact-view').eq(num).addClass('active');
			$('li.full-view').eq(num).addClass('active');
			todayBirthday(saveNotes, nowData);
			save();
			emptyFields(num);
		};
	});

// Выделение в компактном списке
	$('ul.compact-view').on('click', 'li.compact-view:not(.active)', function(){
		num = $(this).index();
		$(this)
			.parent().children().removeClass('active')
			.closest('.container').find('li.full-view').removeClass('active').eq(num)
			.addClass('active').css({opacity : '0'}).animate({opacity : '1'},750);
		$(this).addClass('active');
		
		emptyFields(num);
	});

// Поиск
	$('.search').keyup(function(){
		$('li.compact-view').css({display : 'none'});
		valueSearch = $('.search').val();

		function searching(saveNotes,valueSearch) {
			for(i=0; i<saveNotes.length; i++){
				if(
					saveNotes[i].firstName === valueSearch || saveNotes[i].lastName === valueSearch ||
					saveNotes[i].mobile === valueSearch || saveNotes[i].home === valueSearch
					|| saveNotes[i].work === valueSearch
				) {
					$('li.compact-view').css({borderBottom : 'none'}).eq(i).css({
						display : 'block',
						borderBottom : '1px solid grey'
					});
				};
			};
		};
		searching(saveNotes,valueSearch);
	});

// Показать все контакты
	$('.show-all').click(function(){
		$('li.compact-view').css({
			display : 'block',
			borderBottom : 'none'
		}).last().css({borderBottom : '1px solid grey'});
	});
});