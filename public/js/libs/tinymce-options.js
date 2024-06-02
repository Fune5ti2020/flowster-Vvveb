var noWrapNodes = "p > img,p > video, p > figure";
var wrapNodes = ['B','I','SPAN', 'TABLE', 'P', 'H1', 'H2', 'H3', 'H4'];

function fixWrapper(doc){
	let body = doc.body;

	body.querySelectorAll(noWrapNodes + ",.post-content > *").forEach(e => {
		//if the element is the only node inside the paragraph and is not an inline element
		if (!e.nextSibling && !e.previousSibling && (wrapNodes.indexOf(e.tagName) == -1)) {
			if (e.parentNode.parentNode.tagName !== "HTML") {
				let div = body.ownerDocument.createElement('div');
				e.parentNode.parentNode.replaceChild(div, e.parentNode);
				//e.parentNode.parentNode.insertBefore(div, e.parentNode);
				div.append(e);
				//e.parentNode.remove();
				//e.parentNode.parentNode.replaceChild(e, e.parentNode);
			}
		}
	});

	if(!body.querySelector('.post-content') && body.tagName == "BODY" && body.id == "tinymce"){
		  const wrappingElement = body.ownerDocument.createElement('div');
		  wrappingElement.setAttribute("class","post-content");
		  
		  
		  while(body.firstChild) {
			wrappingElement.appendChild(body.firstChild);
		  }
		  
		  body.appendChild(wrappingElement);
    }	
}

const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches;

let tinyMceSkin = "oxide";
let tinyMceTheme = 'auto'
if (window.matchMedia("(prefers-color-scheme: dark)").matches || (document.documentElement.dataset.bsTheme == "dark")) {
	tinyMceSkin = "oxide-dark";
	tinyMceTheme = 'dark';
}

let make_wysiwyg = function(inst){
    fixWrapper(inst.contentDocument);
     //set dark theme
    inst.contentDocument.documentElement.setAttribute("data-bs-theme", tinyMceTheme);
}


const tinymce_image_upload_handler = (blobInfo, progress) => new Promise((resolve, reject) => {
	
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.open('POST', uploadUrl);

  xhr.upload.onprogress = (e) => {
    progress(e.loaded / e.total * 100);
  };

  xhr.onload = () => {
    if (xhr.status === 403) {
      reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
      return;
    }

    if (xhr.status < 200 || xhr.status >= 300) {
      reject('HTTP Error: ' + xhr.status);
      return;
    }
	/*
    const json = JSON.parse(xhr.responseText);

    if (!json || typeof json.location != 'string') {
      reject('Invalid JSON: ' + xhr.responseText);
      return;
    }

    resolve(json.location);*/
	resolve(mediaPath + "/" + xhr.responseText);
  };

  xhr.onerror = () => {
    reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
  };

  const formData = new FormData();
  formData.append('file', blobInfo.blob(), blobInfo.filename());
  formData.append('file', blobInfo.blob(), blobInfo.filename());

  formData.append("mediaPath", mediaPath);
  formData.append("onlyFilename", true);


  xhr.send(formData);
});


let tinyMceOptions = {
  selector: "textarea.html",
  body_class: "container",
  init_instance_callback : make_wysiwyg,
  setup: function (editor) {
	//set changes to false to avoid saving unchanged revisions if text is not changed
	let has_changes = document.getElementById(editor.id)?.parentNode.querySelector(".has_changes");
	if (has_changes) {
		has_changes.value = "0";
	}

	 editor.ui.registry.addButton('quickmedia', {
        icon: 'image',
        tooltip: 'Insert media',
        onAction: function () {
			if (!Vvveb.MediaModal) {
				Vvveb.MediaModal = new MediaModal(true);
				Vvveb.MediaModal.mediaPath = mediaPath;
			}
			Vvveb.MediaModal.open(null, function (file) {
                    editor.insertContent("<div>" + editor.dom.createHTML('img', {
                        src: file,
                        "class": "align-center"
                    }) + "</div>");
			});
			//editor.fire("blur");
			editor.dispatch("blur");
			//console.log(editor);
        }
      });
      		
      editor.on('GetContent',function (ed, o) {
			
			if (ed.content.indexOf('<div class="post-content">') > -1) {
				ed.content = ed.content.replace('<div class="post-content">', '').slice(0, -6);
			}
            // remove wrapper prior to extracting content
        });
		/*
        editor.on('NodeChange',function (ed, e) {
			//console.log(ed);
            fixWrapper(this.contentDocument.body); // if wrapper has been deleted, add it back
        });
        editor.on('NewBlock',function (ed, e) {
			//console.log(ed);
            fixWrapper(this.contentDocument.body); // if wrapper has been deleted, add it back
        });
        editor.on('Change',function (ed, e) {
			//console.log(ed);
            fixWrapper(this.contentDocument.body); // if wrapper has been deleted, add it back
        });
        */
        editor.on('SetContent',function (ed, e) {
            fixWrapper(this.contentDocument); // if wrapper has been deleted, add it back
        });
		
		
		editor.on('change', function(ed, e)  {
			// text changed set has_changes flag to save revision
			ed.target.container.parentNode.querySelector(".has_changes").value = "1";
		});

		window.dispatchEvent(new CustomEvent("tinymce.setup", {detail: editor}));
    },
    
  plugins: 'preview searchreplace autolink autosave autoresize directionality code visualblocks visualchars fullscreen image media link table charmap lists wordcount help quickbars emoticons table accordion',
  //valid_children : '-p[img],h1[img],h2[img],h3[img],h4[img],+body[img],div[img],div[h1],div[h2],div[h3]',
  //editimage_cors_hosts: ['picsum.photos'],
  menubar: false,//'file edit view insert format tools table help',
  toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | insertfile image media link anchor | ltr rtl table accordion | fullscreen preview code print |  charmap emoticons advlist visualblocks searchreplace',
  toolbar_sticky: true,
  //toolbar_sticky_offset: isSmallScreen ? 102 : 108,
  autosave_ask_before_unload: true,
  autosave_interval: '30s',
  autosave_prefix: '{path}{query}-{id}-',
  autosave_restore_when_empty: false,
  autosave_retention: '2m',
  image_advtab: true,
  /*
  link_list: [
	{ title: 'My page 1', value: 'https://www.tiny.cloud' },
	{ title: 'My page 2', value: 'http://www.moxiecode.com' }
  ],
  image_list: [
	{ title: 'My page 1', value: 'https://www.tiny.cloud' },
	{ title: 'My page 2', value: 'http://www.moxiecode.com' }
  ],
  */
  image_class_list: [
	{ title: 'None', value: '' },
	{ title: 'Fluid', value: 'img-fluid' }
  ],
  importcss_append: true,
  relative_urls : false,
  convert_urls : false,  
  file_picker_callback: function (callback, value, meta) {
	if (!Vvveb.MediaModal) {
		Vvveb.MediaModal = new MediaModal(true);
		Vvveb.MediaModal.mediaPath = mediaPath;
	}
	Vvveb.MediaModal.open(null, callback);
  },/*
	templates: [{
		title: 'New Table',
		description: 'creates a new table',
		content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>'
	}, {
		title: 'Starting my story',
		description: 'A cure for writers block',
		content: 'Once upon a time...'
	}, {
		title: 'New list with dates',
		description: 'New List with dates',
		content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>'
	}],*/
  template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
  template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
  height: 600,
  image_caption: true,
  quickbars_insert_toolbar: 'quickmedia quicklink quicktable',
  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 h4 blockquote | quickimage quicktable',
  //quickbars_image_toolbar: 'alignleft aligncenter alignright | rotateleft rotateright | imageoptions',
  noneditable_noneditable_class: 'mceNonEditable',
  toolbar_mode: 'wrap',
  contextmenu: 'link image editimage table',
  skin: tinyMceSkin,//'oxide',
  content_css: vvvebThemeCss,
  //content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
  content_style: "body {padding: 10px}",
  images_reuse_filename: true,
  images_upload_url: uploadUrl,
  verify_html: false,
  //force_br_newlines: true,
  //forced_root_block : false,
  //force_p_newlines : false,
  //convert_newlines_to_brs : true,
  /*
  forced_root_block : false,
  force_p_newlines : true,
  */ 
  //extended_valid_elements:"div[*]",
  //invalid_elements: "",
  //forced_root_block : "div",
  //valid_elements: "*[*]",
  apply_source_formatting : false,
  verify_html : false,
  /* we override default upload handler to simulate successful upload*/
  images_upload_handler: tinymce_image_upload_handler,
	formats: {
		alignleft: [{
			selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
			styles: {
				textAlign: "left"
			}
		}, {
			selector: "img,figure,table,video,audio,dl.caption,iframe",
			classes: "align-left"
		}],
		aligncenter: [{
			selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
			styles: {
				textAlign: "center"
			}
		}, {
			selector: "img,figure,table,video,audio,dl.caption,iframe",
			classes: "align-center"
		}],
		alignright: [{
			selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
			styles: {
				textAlign: "right"
			}
		}, {
			selector: "img,figure,table,video,audio,dl.caption,iframe",
			classes: "align-right"
		}],
		strikethrough: {
			inline: "del"
		}
	},	
	
    font_family_formats: "Arial Black=arial black,avant garde; Courier New=courier new,courier; Lato Black=lato; Roboto=roboto;",
	external_plugins: {
		//'test': '../tinymce-plugins/test/plugin.js',
	},    
	branding:false,
	media_live_embeds:true,
	media_filter_html:false,
	visual_table_class:"table mce-item-table",
	table_default_attributes: {
		"class": 'table table-bordered',
   },
  table_class_list: [
	{title: 'None', value: 'table'},
	{title: 'striped', value: 'table-striped'},
	{title: 'dark', value: 'table-dark'},
	{title: 'hover', value: 'table-hover'},
	{title: 'bordered', value: 'table-bordered'},
	{title: 'primary', value: 'table-primary'},
	{title: 'secondary', value: 'table-secondary'},
	{title: 'success', value: 'table-success'},
	{title: 'danger', value: 'table-danger'},
	{title: 'warning', value: 'table-warning'},
	{title: 'info', value: 'table-info'},
	{title: 'light', value: 'table-light'},
	{title: 'dark', value: 'table-dark'},
  ],
  table_cell_class_list: [
	{title: 'primary', value: 'table-primary'},
	{title: 'secondary', value: 'table-secondary'},
	{title: 'success', value: 'table-success'},
	{title: 'danger', value: 'table-danger'},
	{title: 'warning', value: 'table-warning'},
	{title: 'info', value: 'table-info'},
	{title: 'light', value: 'table-light'},
	{title: 'dark', value: 'table-dark'},
  ],
  table_row_class_list: [
	{title: 'primary', value: 'table-primary'},
	{title: 'secondary', value: 'table-secondary'},
	{title: 'success', value: 'table-success'},
	{title: 'danger', value: 'table-danger'},
	{title: 'warning', value: 'table-warning'},
	{title: 'info', value: 'table-info'},
	{title: 'light', value: 'table-light'},
	{title: 'dark', value: 'table-dark'},
  ]
};
