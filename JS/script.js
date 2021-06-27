const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: '1000KM',
            singer: 'Trang',
            path: './Media/1000KM-Trang.mp3',
            image: './Media/Trang.jpg'
        },
        {
            name: 'Sao cung duoc',
            singer: 'Binz',
            path: './Media/Sao-Cung-Duoc-Binz.mp3',
            image: './Media/Binz.jpg'
        },
        {
            name: 'Vai lan don dua',
            singer: 'Soobin',
            path: './Media/Vai-Lan-Don-Dua-Cover-SOOBIN-Touliver.mp3',
            image: './Media/Soobin.jpg'
        },
        {
            name: 'Cry On My Shoulder',
            singer: 'Super Stars',
            path: './Media/Cry-On-My-Shoulder-Super-Stars.mp3',
            image: './Media/cry.jpg'
        },
        {
            name: 'Proud Of You',
            singer: 'Various Artists',
            path: './Media/Proud-Of-You-Various-Artists.mp3',
            image: './Media/proud.jpg'
        },
        {
            name: 'Phố đã lên đèn',
            singer: 'Huyền Tâm Môn',
            path: './Media/Phố Đã Lên Đèn - Huyền Tâm Môn「Lo - Fi Version by 1 9 6 7」_ Audio Lyrics-320k.mp3',
            image: './Media/pholenden.jpg'
        },
        {
            name: 'Chỉ là muốn nói',
            singer: 'Khải',
            path: './Media/ChiLaMuonNoi1-Khai-6992852.mp3',
            image: './Media/chilamuonnoi.jpg'
        },
        {
            name: 'Giữa đại lộ đông tây',
            singer: 'Uyên Linh',
            path: './Media/GiuaDaiLoDongTaySoloVersion-UyenLinh-6999584.mp3',
            image: './Media/uyenlinh.jpg'
        },
        {
            name: 'Cô ấy nói',
            singer: 'Ngô Anh Đạt',
            path: './Media/Co Ay Noi Lofi Version_ - Ngo Anh Dat_ F.mp3',
            image: './Media/ngoanhdat.jpg'
        }
    ],

    render() {
        const htmls = this.songs.map((song, index)=> {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
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

    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents() {
        
        const cdWidth = cd.offsetWidth

        // xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        // xử lý phóng to thu mhor CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const cdNewWidth = cdWidth - scrollTop

            cd.style.width = cdNewWidth > 0 ? cdNewWidth + 'px' : 0
            cd.style.opacity = cdNewWidth / cdWidth
        }

        // xử lý khi click play button
        playBtn.onclick = function() {
            if(app.isPlaying) { 
                audio.pause()
            }
            else {
                audio.play()
            }
            
        }

        // khi song được play
        audio.onplay = function() {
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // khi song được pause 
        audio.onpause = function() {
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // khi tiến dộ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }

        }

        // xử lý khi tua song
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // khi next song
        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.playRandomSong()
            }
            else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // khi prev song
        prevBtn.onclick = function() {
            if(app.isRandom) {
                app.playRandomSong()
            }
            else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()

        }

        // xử lý bật / tắt random song
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            this.classList.toggle('active', app.isRandom)
        }

        // xử lý lặp lại một song
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat
            this.classList.toggle('active', app.isRepeat)
        }

        // xử lý next song khi audio ended
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play()
            }
            else {
                nextBtn.click()
            }   
        }

    },

    scrollToActiveSong() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },

    loadCurrentSong() {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        console.log(heading,cdThumb,audio)
    },

    nextSong() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length
        }
        this.loadCurrentSong()
    },

    playRandomSong(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while (newIndex == this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start() {
        // định nghĩa các thuộc tính cho object
        this.defineProperties()

        // xử lý các sự kiện 
        this.handleEvents()

        // tải bài hát đầu tiên lên UI khi chạy ứng dụng
        this.loadCurrentSong()

        // render playlist
        this.render()
    }

}

app.start()