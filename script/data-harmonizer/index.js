/**
 * @fileOverview This implements DataHarmonizer, a browser-based spreadsheet
 * application that operates off of LinkML templates. Currently can be run
 * locally without a webserver, thus providing ease-of-use and security.
 * Functionality for uploading, downloading and validating data.
 * Implemented with https://handsontable.com/ "handsontable" widget.
 *
 * NOTE: If you are using Chrome javascript debugger console: using this
 * tool disables double clicking on HandsonTable cells, so you won't see 
 * column help or cell insert/delete row actions, and it seems to disable 
 * the createHot afterRender event/method.
 * 
 * templates/menu.js provides a list of templates available for this widget,
 * which will be displayed in a menu. A template can also be accessed by adding
 * it as a folder name in the URL parameter. This enables testing of a template
 * even if it hasn't been incorporated into the menu.
 *
 * main.html?template=MIxS/soil
 *
 * MIxS example schemas are available at:
 * https://github.com/GenomicsStandardsConsortium/mixs-source/tree/main/model/schema
 *
 */

const VERSION = '0.6.0';
const VERSION_TEXT = 'DataHarmonizer provenance: v' + VERSION;

let DataHarmonizer = {

	//An instance of DataHarmonizer has a schema, a domElement, and a handsontable .hot object
	dhGrid: null,
	dhToolbar: null,
	dhFooter: null,
	schema_name: null,
	template_name: null,
	schema: null,			// Schema holding all templates
	template: null,			// Specific template from schema
	table: null,			// Table data.
	hot: null,
	menu: null,
	export_formats: null,
	invalid_cells: null,
	// Currently selected cell range[row,col,row2,col2]
	current_selection: [null,null,null,null],

	init: function(dhGrid, dhFooter=null, dhToolbar=null, menu=null) {
		this.dhGrid = dhGrid;
		this.dhFooter = dhFooter;
		this.dhToolbar = dhToolbar;
		this.menu = menu;
		const self = this;

		// Field descriptions. Need to account for dynamically rendered cells.
		$(this.dhGrid).on('dblclick', '.secondary-header-cell', (e) => {
			const innerText = e.target.innerText;
			const field = this.getFields(self.template).filter(field => field.title === innerText)[0];
			$(self.dhToolbar).find('.field-description-text').html(self.getComment(field));
			$(self.dhToolbar).find('.field-description-modal').modal('show');
		});

		// Add more rows
		$(this.dhFooter).find('.add-rows-button').click((e) => {
			self.runBehindLoadingScreen(() => {
		  	const numRows = $(this.dhFooter).find('.add-rows-input').val();
		  	self.hot.alter('insert_row', self.hot.countRows()-1 + numRows, numRows);
			});
		});


	},

	//useSchema: function(){},

	/**
	 * Revise user interface elements to match template path, and trigger
	 * load of schema.js and export.js scripts (if necessary).  script.onload goes on
	 * to trigger launch(TABLE).
	 * @param {String} template_path: path of template starting from app's
	 * template/ folder.
	 */
	useTemplate: function(template_path = null) {
		let self = this;
		// If no template_path provided, allow URL parameter ?template=Folder/name 
		// to select template on page load.
		if (!template_path) {
			if (window.URLSearchParams) {
				let params = new URLSearchParams(location.search);
				template_path = params.get('template');
			}
			else {//low-tech way:
				let template_path = location.search.split("template=")[1];
			}
		}

		// Redo of template triggers new data file

		// Validate path if not null:
		if (template_path) {
			[template_folder, template_name] = template_path.split('/',2); 

			if (!(template_folder in this.menu || template_name in this.menu[template_folder]) ) {
		  		return false;
			}
		}
		// If null, do default template setup - the first one in menu
		else {
			// Default template is first key in menu structure
			template_folder = Object.keys(this.menu)[0];
			template_name = Object.keys(this.menu[template_folder])[0];
			template_path = template_folder + '/' + template_name;
		}

		this.schema_name = template_folder;
		this.template_name = template_name;

		// Here TABLE file of specifications already loaded 
		if (this.schema && this.schema.folder == template_folder) {

			this.template = this.processTemplate(template_name);
			//setupToolbar(TABLE, template_path);

			//this.newHotFile();
			this.createHot();
			// Asynchronous. Since SCHEMA loaded, export.js should succeed as well.
			this.reloadJs('export.js', this.exportOnload);

		}
		// A switch to this template requires reloading the SCHEMA it is under
		else {
			this.reloadJs('schema.js', this.useTemplate, [template_path]);
		}

	},

	/**
	 * Open file specified by user.
	 * Only opens `xlsx`, `xlsx`, `csv` and `tsv` files. Will launch the specify
	 * headers modal if the file's headers do not match the grid's headers.
	 * @param {File} file User file.
	 * @param {Object} xlsx SheetJS variable.
	 * @return {Promise<>} Resolves after loading data or launching specify headers
	 *     modal.
	 */
	openFile: function(file) {
		return new Promise((resolve) => {
			const fileReader = new FileReader();
			const self = this;

			fileReader.readAsBinaryString(file);

			fileReader.onload = (e) => {

// CHANGE: to function returns false or file.name

				$('#file_name_display').text(file.name); 

				const workbook = XLSX.read(e.target.result, {
					type: 'binary', 
					raw: true,
					cellDates: true, // Ensures date formatted as  YYYY-MM-DD dates
					dateNF: 'yyyy-mm-dd' //'yyyy/mm/dd;@'
				});
				const worksheet = this.updateSheetRange(workbook.Sheets[workbook.SheetNames[0]]);
				const matrix = (XLSX.utils.sheet_to_json(
					worksheet, 
					{
						header: 1, 
						raw: false, 
						range: 0
					}
					));
				const headerRowData = this.compareMatrixHeadersToGrid(matrix, self.template);
				if (headerRowData > 0) {
					this.hot.loadData(matrixFieldChangeRules(matrix.slice(headerRowData), hot, data));
				} 
				else {
					this.launchSpecifyHeadersModal(matrix, hot, data);
				}

				resolve();
			}
		});
	},


	validate: function(){

	},

	newHotFile: function () {
		let self = this;
		//this.runBehindLoadingScreen( () => {
			self.createHot();
		//});
	},

	/**
	 * Create a blank instance of Handsontable.
	 * @param {Object} template.
	 * @return {Object} Handsontable instance.
	 */
	createHot: function () {
		const self = this;

		this.invalid_cells = {};
		if (this.hot) this.hot.destroy(); // handles already existing data
	  	let fields = this.getFields();
	  	this.hot = Handsontable(this.dhGrid, {
		    nestedHeaders: this.getNestedHeaders(),
		    columns: this.getColumns(),
		    colHeaders: true,
		    rowHeaders: true,
		    manualColumnResize: true,
		    //colWidths: [100], //Just fixes first column width
		    contextMenu: ["remove_row","row_above","row_below"],
		    minRows: 100,
		    minSpareRows: 100,
		    width: '100%',
		    height: '75vh',
		    fixedColumnsLeft: 1,
		    hiddenColumns: {
		      copyPasteEnabled: true,
		      indicators: true,
		      columns: [],
		    },
		    hiddenRows: {
		      rows: [],
		    },
		    // Handsontable's validation is extremely slow with large datasets
		    invalidCellClassName: '',
		    licenseKey: 'non-commercial-and-evaluation',
		    // beforeChange source: https://handsontable.com/docs/8.1.0/tutorial-using-callbacks.html#page-source-definition
		    beforeChange: function(changes, source) { 
				if (!changes) return;

				// When a change in one field triggers a change in another field.
				var triggered_changes = []; 

				for (const change of changes) {
					const column = change[1];
					// Check field change rules
					self.fieldChangeRules(change, fields, triggered_changes);
				}
				// Add any indirect field changes onto end of existing changes.
				if (triggered_changes) 
					changes.push(...triggered_changes);
		    },
		    afterInit: () => {
		      $('#next-error-button, #no-error-button').hide();
		    },
		    afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
		      self.current_selection = [row, column, row2, column2];
		    },
		    afterRender: (isForced) => {
		      $('.data-harmonizer-header').css('visibility', 'visible');
		      $('.data-harmonizer-footer').css('visibility', 'visible');

		      // Bit of a hackey way to RESTORE classes to secondary headers. They are
		      // removed by Handsontable when re-rendering main table.
		      $('.secondary-header-text').each((_, e) => {
		        const $cellElement = $(e).closest('th');
		        $cellElement.addClass('secondary-header-cell');
		        if ($(e).hasClass('required')) {
		        	$cellElement.addClass('required');
		        } else if ($(e).hasClass('recommended')) {
		        	$cellElement.addClass('recommended');
		        } 
		      });
		    },
		    afterRenderer: (TD, row, col) => {
		      if (self.invalid_cells.hasOwnProperty(row)) {
		        if (self.invalid_cells[row].hasOwnProperty(col)) {
		          const msg = self.invalid_cells[row][col];
		          $(TD).addClass(msg ? 'empty-invalid-cell' : 'invalid-cell');
		        }
		      }
		    },
		  }
		);

		this.enableMultiSelection();


	},

	/**
	 * Modify visibility of columns in grid. This function should only be called
	 * after clicking a DOM element used to toggle column visibilities.
	 * @param {String} id Id of element clicked to trigger this function. Defaults to show all.
	 * @param {Object} data See TABLE.
	 * @param {Object} hot Handsontable instance of grid.
	 */
	changeColVisibility: function (id = 'show-all-cols-dropdown-item') {
	  // Grid becomes sluggish if viewport outside visible grid upon re-rendering
	  this.hot.scrollViewportTo(0, 1);
	  const domEl = $('#' + id);

	  // Un-hide all currently hidden cols
	  const hiddenColsPlugin = this.hot.getPlugin('hiddenColumns');
	  hiddenColsPlugin.showColumns(hiddenColsPlugin.hiddenColumns);

	  // Hide user-specied cols
	  const hiddenColumns = [];

	  // If accessed by menu, disable that menu item, and enable the others
	  $('#show-all-cols-dropdown-item, #show-required-cols-dropdown-item, #show-recommended-cols-dropdown-item, .show-section-dropdown-item')
	    .removeClass('disabled');
	  domEl.addClass('disabled');


	  //Request may be for only required fields, or required+recommended fields
	  let required = (id === 'show-required-cols-dropdown-item');
	  let recommended = (id === 'show-recommended-cols-dropdown-item');
	  if (required || recommended) {
	    this.getFields().forEach(function(field, i) {
	      if (required && !field.required)
	        hiddenColumns.push(i);
	      else 
	        if (recommended && !(field.required || field.recommended))
	          hiddenColumns.push(i);
	    });
	  }

	  // prefix of ID indicates if it is a command to show just one section.
	  else if (id.indexOf('show-section-') === 0) {
	    const section_name = domEl.text();
	    let column_ptr = 0;
	    for (section of data) {
	      for (column of section.children) {
	        // First condition ensures first (row identifier) column is not hidden
	        if (column_ptr > 0 && section.title != section_name) {
	          hiddenColumns.push(column_ptr)
	        }
	        column_ptr ++;
	      }
	    };
	  }
	  hiddenColsPlugin.hideColumns(hiddenColumns);
	  this.hot.render();
	},

	/**
	 * Modify visibility of rows in grid. This function should only be called
	 * after clicking a DOM element used to toggle row visibilities.
	 * @param {String} id Id of element clicked to trigger this function.
	 * @param {Object<Number, Set<Number>>} invalidCells See `getInvalidCells`
	 *     return value.
	 * @param {Object} hot Handsontable instance of grid.
	 */
	changeRowVisibility: function (id, invalidCells) {
	  // Grid becomes sluggish if viewport outside visible grid upon re-rendering
	  this.hot.scrollViewportTo(0, 1);

	  // Un-hide all currently hidden cols
	  const hiddenRowsPlugin = hot.getPlugin('hiddenRows');
	  hiddenRowsPlugin.showRows(hiddenRowsPlugin.hiddenRows);

	  // Hide user-specified rows
	  const rows = [...Array(this.hot.countRows()).keys()];
	  const emptyRows = rows.filter(row => this.hot.isEmptyRow(row));
	  let hiddenRows = [];

	  if (id === 'show-valid-rows-dropdown-item') {
	    hiddenRows = Object.keys(invalidCells).map(Number);
	    hiddenRows = [...hiddenRows, ...emptyRows];
	  } 
	  else if (id === 'show-invalid-rows-dropdown-item') {
	    const invalidRowsSet = new Set(Object.keys(invalidCells).map(Number));
	    hiddenRows = rows.filter(row => !invalidRowsSet.has(row));
	    hiddenRows = [...hiddenRows, ...emptyRows];
	  }

	  hiddenRowsPlugin.hideRows(hiddenRows);
	  this.hot.render();
	},

	/**
	 * Get the 0-based y-index of every field on the grid.
	 * @param {Object} data See TABLE.
	 * @return {Object<String, Number>} Fields mapped to their 0-based y-index on
	 *     the grid.
	 */
	getFieldYCoordinates: function () {
	  const ret = {};
	  for (const [i, field] of this.getFields().entries()) {
	    ret[field.title] = i;
	  }
	  return ret;
	},

	getColumnCoordinates: function () {
	  const ret = {};
	  let column_ptr = 0;
	  for (section of this.template) {
	    ret[section.title] = column_ptr;
	    for (column of section.children) {
	      ret[' . . ' + column.title] = column_ptr;
	      column_ptr ++;
	    }
	  }
	  return ret;
	},

	/**
	 * Scroll grid to specified column.
	 * @param {String} row 0-based index of row to scroll to.
	 * @param {String} column 0-based index of column to scroll to.
	 * @param {Object} data See TABLE.
	 * @param {Object} hot Handsontable instance of grid.
	 */
	scrollTo: function (row, column) {

	  const hiddenCols = this.hot.getPlugin('hiddenColumns').hiddenColumns;
	  if (hiddenCols.includes(column)) 

	  	// If user wants to scroll to a hidden column, make all columns unhidden
	    this.changeColVisibility(undefined);

	  this.hot.selectCell(parseInt(row), parseInt(column), parseInt(row), parseInt(column), true);
	  //Ensures field is positioned on left side of screen.
	  this.hot.scrollViewportTo(row, column);

	},

/***************************** PRIVATE functions *************************/

	/**
	 * Ask user to specify row in matrix containing secondary headers before load.
	 * Calls `alertOfUnmappedHeaders` if necessary.
	 * @param {Array<Array<String>} matrix Data that user must specify headers for.
	 * @param {Object} hot Handsontable instance of grid.
	 * @param {Object} data See `data.js`.
	 */
	launchSpecifyHeadersModal: function(matrix) {
		let flatHeaders = this.getFlatHeaders();
		const self = this;
		if (flatHeaders) {
			// CHANGE to class search:
			$('#expected-headers-div').html(flatHeaders[1].join('   '));
			$('#actual-headers-div').html(matrix[1].join('    '));
			$('#specify-headers-modal').modal('show');
			$('#specify-headers-confirm-btn').click(() => {
				const specifiedHeaderRow = parseInt($('#specify-headers-input').val());
				if (!this.isValidHeaderRow(matrix, specifiedHeaderRow)) {
					$('#specify-headers-err-msg').show();
				} 
				else {
					const mappedMatrixObj = this.mapMatrixToGrid(matrix, specifiedHeaderRow-1, this.template);
					$('#specify-headers-modal').modal('hide');
					runBehindLoadingScreen(() => {
						self.hot.loadData(matrixFieldChangeRules(mappedMatrixObj.matrix.slice(2), hot, data));
						if (mappedMatrixObj.unmappedHeaders.length) {
							const unmappedHeaderDivs = mappedMatrixObj.unmappedHeaders.map(header => `<li>${header}</li>`);
							$('#unmapped-headers-list').html(unmappedHeaderDivs);
							$('#unmapped-headers-modal').modal('show');
						}
					});
				}
			});
		}
	},


	/**
	* Determine if first or second row of a matrix has the same headers as the 
	* grid's secondary (2nd row) headers.  If neither, return false.
	* @param {Array<Array<String>>} matrix
	* @param {Object} data See `data.js`.
	* @return {Integer} row that data starts on, or false if no exact header row
	* recognized.
	*/
	compareMatrixHeadersToGrid: function (matrix) {
		const expectedSecondRow = this.getFlatHeaders()[1];
		const actualFirstRow = matrix[0];
		const actualSecondRow = matrix[1];
		if (JSON.stringify(expectedSecondRow) === JSON.stringify(actualFirstRow))
			return 1;
		if (JSON.stringify(expectedSecondRow) === JSON.stringify(actualSecondRow))
			return 2;
		return false;
	},

	/**
	* Validates `$('#specify-headers-input')` input.
	* @param {Array<Array<String>>} matrix
	* @param {number} row 1-based index used to indicate header row in matrix.
	*/
	isValidHeaderRow: function (matrix, row) {
		return Number.isInteger(row) && row > 0 && row <= matrix.length;
	},

	/**
	* Create a matrix containing the grid's headers. Empty strings are used to
	* indicate merged cells.
	* @return {Array<Array<String>>} Grid headers.
	*/
	getFlatHeaders: function() {
		const rows = [[], []];

		for (const parent of this.template) {
			let min_cols = parent.children.length;
			if (min_cols < 1) {
				// Close current dialog and switch to error message
				//$('specify-headers-modal').modal('hide');
				//$('#unmapped-headers-modal').modal('hide');
				const errMsg = `The template for the loaded file has a configuration error:<br/>
				<strong>${parent.title}</strong><br/>
				This is a field that has no parent, or a section that has no fields.`;
				$('#unmapped-headers-list').html(errMsg);
				$('#unmapped-headers-modal').modal('show');

				return false;
			}
			rows[0].push(parent.title);
			// pad remainder of first row columns with empty values
			if (min_cols > 1)
				rows[0].push(...Array(min_cols-1).fill(''));
			// Now add 2nd row child titles
			rows[1].push(...parent.children.map(child => child.title));
		}
		return rows;
	},

	/**
	* Map matrix columns to grid columns.
	* Currently assumes mapped columns will have the same label, but allows them
	* to be in a different order. If the matrix is missing a column, a blank
	* column is used.
	* @param {Array<Array<String>>} matrix
	* @param {Number} matrixHeaderRow Row containing matrix's column labels.
	* @return {MappedMatrixObj} Mapped matrix and details.
	*/
	mapMatrixToGrid: function (matrix, matrixHeaderRow) {
		const expectedHeaders = this.getFlatHeaders();
		const expectedSecondaryHeaders = expectedHeaders[1];
		const actualSecondaryHeaders = matrix[matrixHeaderRow];

		// Map current column indices to their indices in matrix to map
		const headerMap = {};
		const unmappedHeaders = [];
		for (const [i, expectedVal] of expectedSecondaryHeaders.entries()) {
			headerMap[i] = actualSecondaryHeaders.findIndex((actualVal) => {
				return actualVal === expectedVal;
			});
			if (headerMap[i] === -1) unmappedHeaders.push(expectedVal);
		}

		const dataRows = matrix.slice(matrixHeaderRow + 1);
		const mappedDataRows = [];
		// Iterate over non-header-rows in matrix to map
		for (const i of dataRows.keys()) {
			mappedDataRows[i] = [];
			// Iterate over columns in current validator version
			for (const j of expectedSecondaryHeaders.keys()) {
				// -1 means the matrix to map does not have this column
				if (headerMap[j] === -1) {
					mappedDataRows[i][j] = '';
				} 
				else {
					mappedDataRows[i][j] = dataRows[i][headerMap[j]];
				}
			}
		}

		return {
			matrix: [...expectedHeaders, ...mappedDataRows],
			unmappedHeaders: unmappedHeaders,
		};
	},


	/**
	* Download matrix to file.
	* Note that BOM and UTF-8 can create problems on some systems when importing
	* file.  See "Supported Output Formats" and "UTF-16 Unicode Text" sections of
	* https://reactian.com/sheetjs-community-edition-spreadsheet-data-toolkit/
	* and https://github.com/SheetJS/sheetjs
	* Solution at bottom of: https://github.com/SheetJS/sheetjs/issues/943
	* The "Comma Separated Values" format is actually UTF-8 with BOM prefix.
	* @param {Array<Array<String>>} matrix Matrix to download.
	* @param {String} baseName Basename of downloaded file.
	* @param {String} ext Extension of downloaded file.
	*/
	exportFile: function (matrix, baseName, ext) {

		const worksheet = xlsx.utils.aoa_to_sheet(matrix);
		const workbook = xlsx.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		switch (ext) {
			case 'xlsx':
				XLSX.writeFile(workbook, `${baseName}.xlsx`);
				break;
			case 'xls':
				XLSX.writeFile(workbook, `${baseName}.xls`);
				break;
			case 'tsv':
				XLSX.writeFile(workbook, `${baseName}.tsv`, {bookType: 'csv', FS: '\t'});
				break;
			case 'csv':
				XLSX.writeFile(workbook, `${baseName}.csv`, {bookType: 'csv', FS: ','});
				break;
			case 'tsv (UTF-16)':
				XLSX.writeFile(workbook, `${baseName}.tsv`, {bookType: 'txt', FS: '\t'});
				break;
			case 'csv (UTF-16)':
				XLSX.writeFile(workbook, `${baseName}.csv`, {bookType: 'txt', FS: ','});
				break;
			case 'csv (UTF-8, no BOM)': 
				//Customization: skips BOM prefix '\uFEFF' 
				const csv = XLSX.utils.sheet_to_csv(worksheet, {FS: ','});
				const blob = new Blob([csv], {type: 'text/plain;charset=UTF-8'});
				//A FileSaver module call, avoids {autoBom: true} parameter
				saveAs(blob, `${baseName}.csv`);
				break;
			case 'csv (ASCII)': 
				//Customization: skips BOM prefix, as above.
				const csv2 = XLSX.utils.sheet_to_csv(worksheet, {FS: ','});
				const blob2 = new Blob([csv2], {type: 'text/plain;charset=us-ascii'});
				saveAs(blob2, `${baseName}.csv`);
				break;
		}
	},


	/**
	 * Get a flat array of all fields (slot definitions) in SCHEMA.
	 * @param {Object} data See SCHEMA.
	 * @return {Array<Object>} Array of all objects under `children` in SCHEMA.
	 */
	getFields: function() {
		let self = this;
		return Array.prototype.concat.apply([], self.template.map(parent => parent.children));
	},

	/**
	 * Create a matrix containing the nested headers supplied to Handsontable.
	 * These headers are HTML strings, with useful selectors for the primary and
	 * secondary header cells.
	 * @param {Object} data See TABLE.
	 * @return {Array<Array>} Nested headers for Handontable grid.
	 */
	getNestedHeaders: function() {
	  const rows = [[], []];
	  for (const parent of this.template) {
	    rows[0].push({
	      label: `<h5 class="pt-2 pl-1">${parent.title}</h5>`,
	      colspan: parent.children.length
	    });
	    for (const child of parent.children) {
	      const required = child.required ? ' required' : '';
	      const recommended = child.recommended ? ' recommended' : '';
	      const name = child.title;
	      rows[1].push(`<div class="secondary-header-text${required}${recommended}">${name}</div>`);
	    }
	  }
	  return rows;
	},

	/**
	 * Create an array of cell properties specifying data type for all grid columns.
	 * AVOID EMPLOYING VALIDATION LOGIC HERE -- HANDSONTABLE'S VALIDATION
	 * PERFORMANCE IS AWFUL. WE MAKE OUR OWN IN `VALIDATE_GRID`.
	 * @param {Object} data See TABLE.
	 * @return {Array<Object>} Cell properties for each grid column.
	 */
	getColumns: function () {
	  let ret = [];
	  for (const field of this.getFields()) {
	    const col = {};
	    if (field.required) {
	      col.required = field.required;
	    }
	    if (field.recommended) {
	      col.recommended = field.recommended;
	    }
	    // Compile field's regular expression for quick application.
	    if (field.pattern) {
	      // Issue with NMDC MIxS "current land use" field pattern: "[ ....(all sorts of things) ]" syntax.
	      NMDC_regex = field.pattern.replaceAll("(", "\(").replaceAll(")", "\)").replace("[", "(").replace("]", ")")
	      field.pattern = new RegExp(NMDC_regex);
	    }

	    col.source = null;

	    if (field.flatVocabulary) {
	        
	      col.source = field.flatVocabulary;

	      if (field.multivalued === true) {
	        col.editor = 'text';
	        col.renderer = 'autocomplete';
	      }
	      else {
	        col.type = 'autocomplete';
	        col.trimDropdown = false;
	      }

	    }

	    if (field.metadata_status) {
	      col.source.push(...field.metadata_status);

	    }

	    switch (field.datatype) {

	      case 'xsd:date': 
	        col.type = 'date';
	        // This controls calendar popup date format, default is mm/dd/yyyy
	        // See https://handsontable.com/docs/8.3.0/Options.html#correctFormat
	        col.dateFormat = 'YYYY-MM-DD';
	        // If correctFormat = true, then on import and on data
	        // entry of cell will convert date values like "2020" to "2020-01-01"
	        // automatically.
	        col.correctFormat = false; 
	        break;

	      //case 'xsd:float':
	      //case 'xsd:integer':
	      //case 'xsd:nonNegativeInteger':
	      //case 'xsd:decimal':
	      default:
	        if (field.metadata_status) {
	          col.type = 'autocomplete';
	        }
	        break;
	    }


	    ret.push(col);
	  }
	  return ret;
	},


	/**
	 * Enable multiselection on select rows.
	 * Indentation workaround: multiples of "  " double space before label are 
	 * taken to be indentation levels.
	 * @param {Object} hot Handonstable grid instance.
	 * @param {Object} data See TABLE.
	 * @return {Object} Grid instance with multiselection enabled on columns
	 * specified as such in the vocabulary.
	 */
	enableMultiSelection: function () {
	  const fields = this.getFields();
	  this.hot.updateSettings({
	    afterBeginEditing: function(row, col) {
	      if (fields[col].multivalued === true) {
	        const value = this.getDataAtCell(row, col);
	        let selections = value && value.split(';') || [];
	        selections = selections.map(x => x.trim());
	        selections2 = selections.filter(function (el) {return el != ''});
	        // Cleanup of empty values that can occur with leading/trailing or double ";"
	        if (selections.length != selections2.length)
	          this.setDataAtCell(row, col, selections2.join('; '), 'thisChange');
	        const self = this;
	        let content = '';
	        if (fields[col].flatVocabulary)
	          fields[col].flatVocabulary.forEach(function(field, i) {
	            const field_trim = field.trim();
	            let selected = selections.includes(field_trim) ? 'selected="selected"' : '';
	            let indentation = field.search(/\S/) * 8; // pixels
	            content += `<option value="${field_trim}" ${selected}' style="padding-left:${indentation}px">${field}</option>`;
	          })

	        $('#field-description-text').html(`${fields[col].title}<select multiple class="multiselect" rows="15">${content}</select>`);
	        $('#field-description-modal').modal('show');
	        $('#field-description-text .multiselect')
	          .chosen() // must be rendered when html is visible
	          .change(function () {
	            let newValCsv = $('#field-description-text .multiselect').val().join('; ')
	            self.setDataAtCell(row, col, newValCsv, 'thisChange');
	          }); 
	      }
	    },
	  });
	},

	/**
	 * Run void function behind loading screen.
	 * Adds function to end of call queue. Does not handle functions with return
	 * vals, unless the return value is a promise. Even then, it only waits for the
	 * promise to resolve, and does not actually do anything with the value
	 * returned from the promise.
	 * @param {function} fn - Void function to run.
	 * @param {Array} [args=[]] - Arguments for function to run.
	 */
	runBehindLoadingScreen: (fn, args=[]) => {
		const self = this;

	  	$('#loading-screen').show('fast', 'swing', function() {
	    	setTimeout(() => {
				const ret = fn.apply(self, args);
				if (ret && ret.then) {
					ret.then(() => {
			  			$('#loading-screen').hide();
					});
				} else {
					$('#loading-screen').hide();
				}
	    	}, 0);
		});
	},

	/**
	 * Reloads a given javascript by removing any old script happening to have the
	 * same URL, and loading the given one. Only in this way will browsers reload
	 * the code. This is mainly designed to load a script that sets a global SCHEMA 
	 * or TEMPLATE variable.
	 * 
	 * @param {String} src_url: path of template starting from app's template folder.
	 * @param {Object} onloadfn: function to run when script is loaded. 
	 */
	reloadJs: function(file_name, onloadfn, load_parameters = null) {
	  const src_url = `./template/${this.schema_name}/${file_name}`;
	  const self = this;

	  $(`script[src="${src_url}"]`).remove();
	  var script = document.createElement('script');
	  if (onloadfn) {

	  	// Important: when script is loaded the onload object context changes
	  	// from the DataHarmonizer object to the script object. Referencing
	  	// the DH context is achieved by "that":

	    script.onload = function () {
	    	if (file_name == 'schema.js') {
	    		self.schema = SCHEMA;
	    	}
	    	if (file_name == 'export.js')
	    		self.export_formats = EXPORT_FORMATS
			if (load_parameters) {
				onloadfn.apply(self, load_parameters);
			}
			else
				onloadfn.apply(self);
	    };
	  };
	  script.onerror = function() {
	    $('#missing-template-msg').text(`Unable to load template file "${src_url}". Is the template name correct?`);
	    $('#missing-template-modal').modal('show');
	    $('#template_name_display').text('');
	    return false;
	  };
	  // triggers load
	  script.src = src_url;
	  document.head.appendChild(script);

	},

	/**
	 * Post-processing of values in `data.js` at runtime. This calculates for each
	 * categorical field (table column) in data.js a flat list of allowed values
	 * in field.flatVocabulary,
	 * @param {Object} template_name.
	 * @return {Object} Processed values of `data.js`.
	 */
	processTemplate: function (template_name) {
	  let template = []; // This will hold template's new data including table sections.
	  let self = this;

	  const sectionIndex = new Map();
	  const specification = self.schema['specifications'][template_name];

	  // LinkML slots sometimes mentions a few fields that slot_usage doesn't have;
	  // and similarly slot_usage has many imported/common fields not in slots,
	  // so loop through a combined list of slots and slot_usages, and use them
	  // to determine sections and populate them
	  const specification_slots      = specification.slots;
	  const specification_slot_usage = specification.slot_usage || {};
	  const combined = [...new Set([...Object.keys(specification_slot_usage), ...Object.keys(specification_slots) ])];

	  /* Lookup each column in terms table. A term looks like:
	    is_a: "core field", 
	    title: "history/fire", 
	    slot_uri: "MIXS:0001086"
	    comments: (3) ['Expected value: date', 'Occurrence: 1', 'This field is used uniquely in: soil']
	    description: "Historical and/or physical evidence of fire"
	    examples: [{…}], 
	    multivalued: false, 
	    range: "date",
	    ...
	  */
	  combined.forEach(function (name) {

	    // EXPERIMENTAL - should be merging in the order of overrided attributes?!
	    const field =  Object.assign({}, self.schema.slots[name], specification_slots[name], specification_slot_usage[name]);

	    let section_title = null;

	    if ('slot_group' in field) {
	      // We have a field positioned within a section (or hierarchy)
	      section_title = field.slot_group;
	    }
	    else if ('is_a' in field) {
	      section_title = field.is_a;
	    }

	    // We have a field positioned within a section (or hierarchy)
	    if (section_title) {

	      if (! sectionIndex.has(section_title)) {
	        sectionIndex.set(section_title, sectionIndex.size);
	        template.push({
	          'title': section_title, 
	          'children':[]}
	        );
	      }

	      section = template[sectionIndex.get(section_title)];
	      let new_field = {...field}; // shallow copy

	      // Some specs don't add plain english title, so fill that with name
	      // for display.
	      if (!('title' in new_field)) {
	        new_field['title'] = new_field['name'];
	      }

	      new_field.datatype = null;
	      switch (new_field.range) {
	        // LinkML typically translates "string" to "uri":"xsd:string" but
	        // this is problematic because that allows newlines which break
	        // spreadsheet saving of items.
	        //case "string": 
	        // new_field.datatype = "xsd:string";

	        case 'string': 
	          // xsd:token means that string cannot have newlines, multiple-tabs
	          // or spaces.
	          new_field.datatype = 'xsd:token'; // was "xs:token",
	          break;

	        //case "datetime"
	        //case "time"
	        //case "ncname"
	        //case "objectidentifier"
	        //case "nodeidentifier"

	        case 'decimal':
	          new_field.datatype = 'xsd:decimal'; // was xs:decimal
	          break;

	        case 'float':
	          new_field.datatype = 'xsd:float';
	          break;

	        case 'double':
	          new_field.datatype = 'xsd:double'; 
	          break;

	        case 'integer': // int ???
	          new_field.datatype = 'xsd:integer'; // was xs:nonNegativeInteger
	          break;

	        // XML Boolean lexical space accepts true, false, and also 1 
	        // (for true) and 0 (for false).
	        case 'boolean': 
	          new_field.datatype = 'xsd:boolean';
	          break;

	        case 'uri': 
	        case 'uriorcurie': 
	          new_field.datatype = 'xsd:anyURI';
	          break;


	        // https://linkml.io/linkml-model/docs/string_serialization/
	        case 'string_serialization': 
	          // Value A string which provides "{has numeric value} {has unit}" style 
	          // named expressions.  These can be compiled into the .pattern field
	          // if nothing already exists in .pattern

	        case 'has unit': 
	          break;

	        case 'has numeric value':
	          break;

	        // This shows up as a LinkML class - but not formally defined as LinkML spec? 
	        case 'quantity value': // A LinkML class

	          /* LinkML model for quantity value, along lines of https://schema.org/QuantitativeValue

	            description: >-
	              A simple quantity, e.g. 2cm
	            attributes:
	              verbatim:
	                description: >-
	                  Unnormalized atomic string representation, should in syntax {number} {unit}
	              has unit:
	                description: >-
	                  The unit of the quantity
	                slot_uri: qudt:unit
	              has numeric value:
	                description: >-
	                  The number part of the quantity
	                range:
	                  double
	            class_uri: qudt:QuantityValue
	            mappings:
	              - schema:QuantityValue

	          */
	          new_field.datatype = "xsd:token"; //xsd:decimal + unit
	          // PROBLEM: There are a variety of quantity values specified, some allowing units
	          // which would need to go in a second column unless validated as text within column.
	          break;

	        case 'time':
	          new_field.datatype = 'xsd:time';
	          break;
	          
	        case 'datetime':
	          new_field.datatype = 'xsd:datetime';
	          break;

	        case 'date':
	          new_field.datatype = 'xsd:date'; // was xs:date
	          break;

	        default:
	          // Usually a selection list here, possibly .multivalued = true
	          new_field.datatype = 'xsd:token'; // was "xs:token"
	          if (new_field.range in self.schema.enumerations) {
	            new_field.source = self.schema.enumerations[new_field.range].permissible_values;
	            //This calculates for each categorical field in schema.yaml a 
	            // flat list of allowed values (indented to represent hierarchy)
	            new_field.flatVocabulary = self.stringifyNestedVocabulary(new_field.source);

	            // points to an object with .permissible_values ORDERED DICT array.
	            // FUTURE ???? :
	            // it may also have a metadata_values ORDERED DICT array.
	            // ISSUE: metadata_status [missing | not applicable etc. ]
	            // Allow > 1 range?
	            // OR allow {permitted_values: .... , metadata_values: .... }
	          }
	          // .metadata_status is an ordered dict of permissible_values
	          // It is separate so it can be demultipliexed from content values.
	          if (new_field.metadata_status) {}
	      } 

	      // Copying in particular required/ recommended status of a field into
	      // this class / form's context
	      //if (name in specification_slot_usage) {
	      //  Object.assign(new_field, specification_slot_usage[name])
	      //}

	      section['children'].push(new_field);
	    }
	    else {
	     console.log("ERROR: field doesn't have section: ", name );
	    }
	  });

	  return template
	},


	/**
	 * Recursively flatten vocabulary into an array of strings, with each string's
	 * level of depth in the vocabulary being indicated by leading spaces.
	 * e.g., `vocabulary: 'a': {'b':{}},, 'c': {}` becomes `['a', '  b', 'c']`.
	 * @param {Object} vocabulary See `vocabulary` fields in SCHEMA.
	 * @param {number} level Nested level of `vocabulary` we are currently
	 *     processing.
	 * @return {Array<String>} Flattened vocabulary.
	 */
	stringifyNestedVocabulary: function (vocab_list, level=0) {

	  let ret = [];
	  for (const val of Object.keys(vocab_list)) {
	    ret.push('  '.repeat(level) + val);
	    if (vocab_list[val].permissible_values) {
	      ret = ret.concat(this.stringifyNestedVocabulary(vocab_list[val].permissible_values, level+1));
	    }
	  }
	  return ret;
	},


	/**
	 * Get an HTML string that describes a field, its examples etc. for display
	 * in column header.
	 * @param {Object} field Any object under `children` in TABLE.
	 * @return {String} HTML string describing field.
	 */
	getComment: function (field) {
	  let ret = `<p><strong>Label</strong>: ${field.title}</p>
	<p><strong>Description</strong>: ${field.description}</p>`;
	  //if (field.guidance) 
	  //  ret += `<p><strong>Guidance</strong>: ${field.guidance}</p>`;
	  if (field.comments && field.comments.length) {
	    ret += `<p><strong>Guidance</strong>: </p><p>${field.comments.join('</p>\n<p>')}</p>`;
	  }
	  if (field.examples) {
	    // Ignoring all but linkml .value now (which can be empty):
	    let examples = [];
	    for (const [key, item] of Object.entries(field.examples)) {
	      if (item.value.trim().length > 0) {
	        // Sometimes MIxS examples are separated by ";", but other times its part
	        // of a "yes; .... further information ... " format.
	        //examples.push(...item.value.split(';')); // 
	        examples.push(item.value);
	      } 
	    }
	    if (examples.length)
	      ret += `<p><strong>Examples</strong>: </p><ul><li>${examples.join('</li>\n<li>')}</li></ul>`;
	  }
	  if (field.metadata_status) {
	    ret += `<p><strong>Null values</strong>: ${field.metadata_status}</p>`;
	  }
	  return ret;
	},

	/**
	 * Get grid data without trailing blank rows.
	 * @param {Object} hot Handonstable grid instance.
	 * @return {Array<Array<String>>} Grid data without trailing blank rows.
	 */
	getTrimmedData: function() {
	  const gridData = this.hot.getData();
	  let lastEmptyRow = -1;
	  for (let i=gridData.length; i>=0; i--) {
	    if (this.hot.isEmptyRow(i)) {
	      lastEmptyRow = i;
	    } else {
	      break;
	    }
	  }

	  return lastEmptyRow === -1 ? gridData : gridData.slice(0, lastEmptyRow);
	}

}