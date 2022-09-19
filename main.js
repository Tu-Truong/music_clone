const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const player = $('.player')
const cd = $('.cd')
const cdWidth = cd.offsetWidth
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
      {
        name: "She neva knows",
        singer: "Justatee",
        path: './assets/CSS/Music/Song1.mp3',
        image: './assets/CSS/Image/image1.jpg',
      },

      {
        name: "Tệ thật anh nhớ em",
        singer: "Thanh Hưng",
        path: scr ='./assets/CSS/Music/Song2.mp3',
        image: scr='./assets/CSS/Image/image2.jpg'
      },

      {
        name: "Gặp nhau do ý trời",
        singer: "Wind-D",
        path: './assets/CSS/Music/Song3.mp3',
        image: './assets/CSS/Image/image3.jpg'
      },

      {
        name: "I will be there",
        singer: "None",
        path: './assets/CSS/Music/Song4.mp3',
        image: './assets/CSS/Image/image4.jpg'
      }, 

      {
        name: "Lệ duyên tình",
        singer: "Long Nón Lá",
        path: './assets/CSS/Music/Song5.mp3',
        image: './assets/CSS/Image/image5.jpg'
      },

      {
        name: "Bất Diễm",
        singer: "Cổ Cầm - Trung Hoa",
        path: './assets/CSS/Music/Song6.mp3',
        image: './assets/CSS/Image/image6.jpg'
      },

      {
        name: "Độ tộc 2",
        singer: "Độ Mixi",
        path: './assets/CSS/Music/Song7.mp3',
        image: './assets/CSS/Image/image7.jpg'
      }, 

      {
        name: "There's no one at all",
        singer: "Sơn Tùng - MTP",
        path: './assets/CSS/Music/Song8.mp3',
        image: './assets/CSS/Image/image8.jpg'
      }
    ],
    render: function() {
       const htmls = this.songs.map((song, index) => {
        return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index ="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
       })
       $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties :function () {
      Object.defineProperty(this,'currentSong', {
        get:function() {
          return this.songs[this.currentIndex]
        }
      })
    },
    handleEvents: function () {  
     const _this = this
          // Xử lý khi CD quay 
          const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
          ],
            {
              duration: 10000,     //10s
              interation: Infinity
            })
            cdThumbAnimate.pause()
          

          //  Xử lí phóng to thu nhỏ 
        document.onscroll = function() {
          const scrollTop = document.documentElement.scrollTop || window.scrollY
          const newCdWidth = cdWidth - scrollTop

          cd.style.width = newCdWidth + 'px'

          cd.style.width = newCdWidth > 0 ? newCdWidth : 0
          cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lí khi click play
        playBtn.onclick = function() {
           if(_this.isPlaying) {          
             audio.pause()          
           }
           else {            
             audio.play()             
           }
        }
        // khi song được play
            audio.onplay = function() {
              _this.isPlaying =true
              player.classList.add('playing')
              cdThumbAnimate.play()
            }

        // khi song pause
             audio.onpause = function() {
             _this.isPlaying =false
             player.classList.remove('playing')
             cdThumbAnimate.pause()
          }
             
            // khi tiến độ bài hát thay đổi 
          audio.ontimeupdate = function() {
            if (audio.duration) {
              const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
              progress.value = progressPercent
                }
            }

            // Xử lí khi tua 
            progress.onchange = (e) => {
              const seekTime = audio.duration / 100 * e.target.value
              audio.currentTime = seekTime
            }
            // khi next song
            nextBtn.onclick = function() {
              if (_this.isRandom) {
                 _this.playRandomSong()
              } else {
                _this.nextSong()
              }              
              audio.play()
              _this.render()
              _this.scrollToActiveSong()

            }
            // khi lùi song
            prevBtn.onclick = function() {
              if (_this.isRandom) {
                _this.playRandomSong()
              } else {
                _this.prevSong()
              }             
              audio.play()
              _this.render()
              _this.scrollToActiveSong()
            }
            // khi phát ngẫu nhiên 
            randomBtn.onclick = function() {
              _this.isRandom = !_this.isRandom
               randomBtn.classList.toggle('active', _this.isRandom)              
            }
            // Xử lí next khi audio end
            audio.onended = function() {
              if (_this.isRepeat) {
                audio.play()
              } else {
                nextBtn.click()
              }
            }
            //  Xử lí lặp lại bài hát 
            repeatBtn.onclick = function(e) {
              _this.isRepeat = !_this.isRepeat
              repeatBtn.classList.toggle('active', _this.isRepeat) 
            }

            // Lắng nghe hành vi click vào bài hát 
            playlist.onclick = function (e) {
                const songNode = e.target.closest('.song:not(.active)')
              if ( songNode || e.target.closest('.option')) {
                //  Xử lí khi click vào song
                if (songNode) {
                   _this.currentIndex = Number(songNode.dataset.index)
                   _this.loadCurrentSong()
                   _this.render()
                   audio.play()
                }
              }

                //  xử lí khi click vào option
              if(e.target.closest('.option')) {

              }
            }

    },
    loadCurrentSong : function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function () {
        this.currentIndex++
           if (this.currentIndex >= this.songs.length) {
             this.currentIndex = 0
           }
           this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if(this.currentIndex < 0) {
        this.currentIndex = this.songs.length -1 
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
          newIndex = Math.floor(Math.random() * this.songs.length)
        } 
        while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
         setTimeout(() => {
          $('.song.active').scrollIntoView({         
            behavior : 'smooth',
            block:'nearest'                 
          })
         }, 300)
    },

    start:function() {
      // Định nghĩa các thuộc tính cho Ob
        this.defineProperties()

        // Lắng nghe / xử lí các sự kiện (DOM event)
        this.handleEvents()

      // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
      this.loadCurrentSong()

      //  render playlist
        this.render()
    }

}

app.start()

