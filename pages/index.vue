<template>
	<div class='wrapper'>
		<div class='menu-canvas'>
			<v-row style='flex-direction: column' no-gutters>
				<v-col cols="auto">
					<v-tooltip right>
						<template v-slot:activator="{ on }">
							<v-btn :elevation='3' color="blue-grey" class="ma-2 white--text" fab v-on="on" @click='changeMode'>
								<i :class="iconOfMode"/>
							</v-btn>
						</template>
						<span>Сменить режим на <b>"{{ getTextOfMode }}"</b></span>
					</v-tooltip>
				</v-col>
				<v-col v-if='!isDrawing' cols="auto">
					<v-tooltip right>
						<template v-slot:activator="{ on }">
							<v-btn :elevation='3' color="blue-grey" class="ma-2 white--text" fab v-on="on" @click='clearImage'>
								<i class="fas fa-times"/>
							</v-btn>
						</template>
						<span>Удалить загруженное изображение</span>
					</v-tooltip>
				</v-col>
				<v-col v-if='isDrawing' cols="auto">
					<v-menu v-model="menu"
					        :close-on-content-click="false"
					        min-width='250'
					        nudge-right='25'
					        offset-x>
						<template v-slot:activator="{ on }">
							<v-btn :elevation='3' color="blue-grey" class="ma-2 white--text" :disabled='!isDrawing' fab v-on="on">
								<i class="fas fa-paint-brush"/>
							</v-btn>
						</template>
						
						<v-card>
							<v-list>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title>Размер кисти: {{ brushSize }}</v-list-item-title>
										<v-list-item-subtitle class='pt-4'>
											<v-slider v-model="brushSize"
											          max='20'
											          min='10'
											          ticks="always"/>
										</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</v-list>
						</v-card>
					</v-menu>
				</v-col>
				<v-col v-if='isDrawing' cols="auto">
					<v-tooltip right>
						<template v-slot:activator="{ on }">
							<v-btn :elevation='3' color="blue-grey" class="ma-2 white--text" fab :disabled='isMouseDown' v-on="on" @click='clearCanvas'>
								<i class="fas fa-times"/>
							</v-btn>
						</template>
						<span>Очистить поле</span>
					</v-tooltip>
				</v-col>
				<v-col cols="auto">
					<v-tooltip right>
						<template v-slot:activator="{ on }">
							<v-btn color="light-green accent-4"
							       class="ma-2 white--text"
							       fab
							       :disabled='isDisableGetResultButton'
							       :elevation='3'
							       v-on="on"
							       @click='getResults'>
								<i class="fas fa-check"/>
							</v-btn>
						</template>
						<span>Получить результат</span>
					</v-tooltip>
				</v-col>
			</v-row>
		</div>
		<v-stage v-if='isDrawing' ref="canvas" :config="stageSize">
			<v-layer ref='canvasLayer'>
				<v-rect :config="rectangleConfig"
				        @mousemove="handleMouseMove"
				        @mousedown="handleMouseDown"
				        @mouseup="handleMouseUp"
				/>
				<v-line v-for='(line, index) in linesArray' :key='index' :config="getConfigForLine(line)"/>
			</v-layer>
		</v-stage>
		<div v-else class='photo-loader'>
			<vueDropzone id="dropzone"
			             ref="myVueDropzone"
			             :options="dropzoneOptions"
			             :useCustomSlot='true'
			             @vdropzone-thumbnail="thumbnailDropzone"
			             @vdropzone-max-files-exceeded='vdropzoneMaxFilesExceeded'>
				<div class="dropzone-custom-content">
					<h3 class="dropzone-custom-title">
						Перетащите сюда изображения для загрузки!
					</h3>
					<div class="subtitle">
						...или кликните для выбора изображений
					</div>
				</div>
			</vueDropzone>
		</div>
		<v-snackbar v-model="snackbarErrorConfig.snackbar"
		            :bottom="snackbarErrorConfig.y === 'bottom'"
		            :color="snackbarErrorConfig.color"
		            :left="snackbarErrorConfig.x === 'left'"
		            :multi-line="snackbarErrorConfig.mode === 'multi-line'"
		            :right="snackbarErrorConfig.x === 'right'"
		            :timeout="snackbarErrorConfig.timeout"
		            :top="snackbarErrorConfig.y === 'top'"
		            :vertical="snackbarErrorConfig.mode === 'vertical'">
			{{ snackbarErrorConfig.text }}
			<v-btn dark text @click="snackbar = false">
				<i class="fas fa-times"/>
			</v-btn>
		</v-snackbar>
		<div v-if='getResultByImageActivate' class='ml-results'>
			<div class='ml-results__wrapper'>
				<div class='ml-results__close' @click='closeResultsWindow'>
					<i class="fas fa-times"/>
				</div>
				<div v-if='getResultByImageLoading' class='ml-results__loading'>
					<v-progress-circular :size="70" :width="7" color="blue-grey" indeterminate/>
				</div>
				<div v-else class='ml-results__body'>
					<div class='ml-results__body__type'>
						Тип: {{ resultOfFile.type }}
					</div>
					<div class='ml-results__body__text'>
						{{ resultOfFile.text }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import vue2Dropzone from 'vue2-dropzone';
	import 'vue2-dropzone/dist/vue2Dropzone.min.css';

	const width = window.innerWidth;
	const height = window.innerHeight;

	export default {
		components: {
			vueDropzone: vue2Dropzone
		},
		data() {
			return {
				getResultByImageActivate: false,
				getResultByImageLoading:  false,
				resultOfFile:             {
					type: null,
					text: null
				},
				fileData:                 {
					data:       null,
					saveToFile: false
				},

				snackbarErrorConfig: {
					color:    'error',
					mode:     '',
					snackbar: false,
					text:     null,
					timeout:  3000,
					x:        'right',
					y:        'top'
				},
				dropzoneOptions:     {
					url:             'https://httpbin.org/post',
					thumbnailWidth:  150,
					maxFilesize:     0.5,
					maxFiles:        1,
					acceptedFiles:   'image/*',
					previewTemplate: this.templateDropzone()
					// headers:        { 'My-Awesome-Header': 'header value' }
				},

				isDrawing:       true,
				menu:            false,
				text:            null,
				brushSize:       10,
				brushColor:      'black',
				isMouseDown:     false,
				linesArray:      [],
				lastLine:        null,
				stageSize:       {
					width:  width,
					height: height
				},
				rectangleConfig: {
					x:      0,
					y:      0,
					width:  width,
					height: height,
					fill:   'white'
				}
			};
		},
		computed:   {
			getTextOfMode() {
				return (this.isDrawing) ? 'Загрузка фото' : 'Рисование';
			},
			iconOfMode() {
				return {
					'fas fa-palette': !this.isDrawing,
					'far fa-image':   this.isDrawing
				};
			},
			isDisableGetResultButton() {
				return !((this.isDrawing && !this.isMouseDown) || (!this.isDrawing && this.fileData.data !== null));
			}
		},
		beforeDestroy() {
			this.$mouse.$off('is-mouse-down', () => {
				this.isMouseDown = false;
			});
		},
		created() {
			this.$mouse.$on('is-mouse-down', isMouseDown => {
				this.isMouseDown = isMouseDown;
			});
		},
		methods:    {
			getConfigForLine(line) {
				return {
					points:      line.points,
					tension:     0.5,
					lineCap:     'round',
					lineJoin:    'round',
					strokeWidth: this.brushSize,
					stroke:      this.brushColor
				};
			},
			getCanvas() {
				return this.$refs.canvas.getStage();
			},
			getCanvasLayer() {
				return this.$refs.canvasLayer.getStage();
			},
			handleMouseMove(event) {
				const currentPosition = this.getCanvas().getPointerPosition();
				if (this.isMouseDown) {
					this.lastLine.points = this.lastLine.points.concat([ currentPosition.x, currentPosition.y ]);
					this.getCanvasLayer().batchDraw();
				}
			},
			handleMouseDown(event) {
				this.isMouseDown = !this.isMouseDown;
				const currentPosition = this.getCanvas().getPointerPosition();
				this.lastLine = {
					globalCompositeOperation: 'source-over',
					points:                   [ currentPosition.x, currentPosition.y ]
				};
				this.linesArray.push(this.lastLine);
			},
			handleMouseUp() {
				this.isMouseDown = false;
			},
			clearCanvas() {
				this.linesArray = [];
				this.lastLine = null;
			},
			changeMode() {
				this.isDrawing = !this.isDrawing;
				this.resultOfFile.text = null;
				this.resultOfFile.type = null;
				this.getResultByImageActivate = false;
			},
			getDropzone() {
				return this.$refs.myVueDropzone;
			},
			vdropzoneMaxFilesExceeded(file) {
				this.getDropzone().removeFile(file);
				this.snackbarErrorConfig.snackbar = true;
				this.snackbarErrorConfig.text = 'Максимум мозжно загружать только 1 файл';
			},
			clearImage() {
				this.getDropzone().removeAllFiles();
				this.fileData.data = null;
				this.resultOfFile.text = null;
				this.resultOfFile.type = null;
				this.getResultByImageActivate = false;
			},
			templateDropzone() {
				return `<div class='dz-preview dz-file-preview'>
			                <div class='dz-image'>
			                    <div data-dz-thumbnail-bg></div>
			                </div>
			                <div class='dz-details'>
			                    <div class='dz-size'><span data-dz-size></span></div>
			                    <div class='dz-filename'><span data-dz-name></span></div>
			                </div>
			                <div class='dz-progress'><span class='dz-upload' data-dz-uploadprogress></span></div>
			                <div class='dz-error-message'><span data-dz-errormessage></span></div>
			                <div class='dz-success-mark'><div class='wrapper'><i class='fa fa-check'></i></div></div>
			                <div class='dz-error-mark'><i class='fa fa-close'></i></div>
			            </div>
			        `;
			},
			thumbnailDropzone: function (file, dataUrl) {
				var j, len, ref, thumbnailElement;
				if (file.previewElement) {
					this.fileData.data = file.dataURL;

					file.previewElement.classList.remove('dz-file-preview');
					ref = file.previewElement.querySelectorAll('[data-dz-thumbnail-bg]');
					for (j = 0, len = ref.length; j < len; j++) {
						thumbnailElement = ref[j];
						thumbnailElement.alt = file.name;
						thumbnailElement.style.backgroundImage = 'url("' + file.dataURL + '")';
					}
					return setTimeout(((function (_this) {
						return function () {
							return file.previewElement.classList.add('dz-image-preview');
						};
					})(this)), 1);
				}
			},
			closeResultsWindow() {
				this.getResultByImageActivate = false;
			},
			getResults() {
				this.getResultByImageActivate = true;
				this.getResultByImageLoading = true;

				if (this.resultOfFile.text !== null && this.resultOfFile.type !== null) {
					this.getResultByImageLoading = false;
					return;
				}

				if (this.isDrawing) {
					this.fileData.data = this.getCanvas().toDataURL();
					this.fileData.saveToFile = true;
				}

				this.$axios.post('/predict', this.fileData)
					.then((response) => {
						const data = response.data;

						// Проверка на число/текст
						this.resultOfFile.type = (+data.data) ? 'Число' : 'Текст';

						if (data.data.length === 0) {
							this.resultOfFile.text = 'На изображении ничего не обнаружено';
						} else {
							this.resultOfFile.text = data.data;
						}
					})
					.catch((error) => {
						// const data = error.response.data;
					})
					.finally(() => {
						this.getResultByImageLoading = false;
						this.fileData.saveToFile = false;
						this.fileData.data = null;
					});
			}
		}
	};
</script>

<style lang='scss'>
	.wrapper {
		width: 100% !important;
		height: 100% !important;
		position: relative;
		
		#canvas {
			width: 100% !important;
			height: 99% !important;
		}
	}
	
	.menu-canvas {
		position: absolute;
		top: 20px;
		left: 20px;
		width: auto;
		height: auto;
		z-index: 1000;
		
		.v-card {
			cursor: pointer;
		}
	}
	
	.photo-loader {
		height: 100% !important;
		
		.dropzone {
			height: 100% !important;
			position: relative;
			border: 0 !important;
			display: flex;
			justify-content: center;
			background-color: #f6f6f6 !important;
			
			&:hover {
				background-color: #dddddd !important;
			}
			
			.dz-preview {
				position: absolute;
				z-index: 900 !important;
				top: 0;
				left: 0;
				width: 100% !important;
				height: 100% !important;
				background-color: #f6f6f6 !important;
				margin: 0 !important;
				
				&:hover {
					.dz-details {
						opacity: 1;
					}
				}
			}
			
			.dz-details {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-end;
				position: absolute;
				top: 25px;
				right: 25px;
				bottom: unset;
				left: unset;
				width: 200px;
				border-radius: 5px;
				min-width: unset;
				height: 100px;
				font-size: 16px;
				color: black;
				padding: 0 !important;
				max-width: none !important;
				max-height: none !important;
				background-color: white;
				opacity: .5;
				box-shadow: 0 0 3px rgba(0, 0, 0, .5);
				border: 1px solid rgba(0, 0, 0, .7);
			}
			
			.dz-image {
				width: 100% !important;
				height: 100% !important;
				
				> div {
					filter: blur(5px);
					width: inherit;
					height: inherit;
					background-size: contain;
					background-position: center;
				}
				
				> img {
					width: 100%;
				}
			}
			
			.dz-message {
				position: absolute;
				margin: 0 !important;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.dz-success-mark {
				width: 100% !important;
				height: 100% !important;
				margin: 0 !important;
				top: 0;
				left: 0;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				font-size: 80px;
				
				> .wrapper {
					background-color: rgb(119, 119, 119);
					color: white;
					width: 125px !important;
					height: 125px !important;
					border-radius: 75px;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					box-shadow: 0 0 7px rgba(0, 0, 0, .5);
				}
			}
		}
	}
	
	.ml-results {
		z-index: 2000;
		position: absolute;
		bottom: 15px;
		right: 15px;
		display: flex;
		width: 450px;
		border-radius: 5px;
		min-width: unset;
		height: 200px;
		font-size: 16px;
		color: black;
		padding: 1rem !important;
		background-color: white;
		box-shadow: 0 0 3px rgba(0, 0, 0, .5);
		border: 1px solid rgba(0, 0, 0, .7);
		
		&__wrapper {
			position: relative;
			width: 100% !important;
			height: 100% !important;
		}
		
		&__close {
			position: absolute;
			top: 0;
			right: 0;
			color: black;
			z-index: 151;
			
			&:hover {
				cursor: pointer;
			}
		}
		
		&__body {
			width: 100%;
			height: 100%;
			font-size: 16px;
			color: black;
		}
		
		&__loading {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			z-index: 150;
		}
	}
</style>
