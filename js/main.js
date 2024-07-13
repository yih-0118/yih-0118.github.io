const app = Vue.createApp({
    mixins: Object.values(mixins),
    data() {
        return {
            loading: true,
            hiddenMenu: false,
            showMenuItems: false,
            menuColor: false,
            scrollTop: 0,
            renderers: [],
            darkMode: false, // 新增：用於跟踪深色模式狀態
        };
    },
    created() {
        window.addEventListener("load", () => {
            this.loading = false;
        });
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll, true);
        this.render();
        this.initDarkMode(); // 新增：初始化深色模式
        
    },
    methods: {
        render() {
            for (let i of this.renderers) i();
        },
        handleScroll() {
            let wrap = this.$refs.homePostsWrap;
            let newScrollTop = document.documentElement.scrollTop;
            if (this.scrollTop < newScrollTop) {
                this.hiddenMenu = true;
                this.showMenuItems = false;
            } else this.hiddenMenu = false;
            if (wrap) {
                if (newScrollTop <= window.innerHeight - 100) this.menuColor = true;
                else this.menuColor = false;
                if (newScrollTop <= 400) wrap.style.top = "-" + newScrollTop / 5 + "px";
                else wrap.style.top = "-80px";
            }
            this.scrollTop = newScrollTop;
        },
        // 新增：切換深色模式的方法
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            document.body.classList.toggle('dark-mode', this.darkMode);
            localStorage.setItem('darkMode', this.darkMode ? 'enabled' : 'disabled');
            this.updateHighlightStyle(); // 新增：更新 highlight.js 樣式
        },
        updateHighlightStyle() {
            const linkElement = document.getElementById('highlight-css');
            if (linkElement) {
                const theme = this.darkMode ? '<%- theme.highlight.dark_style %>' : '<%- theme.highlight.light_style %>';
                linkElement.href = `https://cdn.jsdelivr.net/npm/highlight.js@11.7.0/styles/${theme}.min.css`;
            }
        },
        // 新增：初始化深色模式的方法
        initDarkMode() {
            const savedMode = localStorage.getItem('darkMode');
            if (savedMode === 'enabled') {
                this.darkMode = true;
                document.body.classList.add('dark-mode');
            }
            this.updateHighlightStyle(); // 新增：初始化時更新 highlight.js 樣式
        },
    },
});


// 深色模式切換
document.addEventListener('DOMContentLoaded', (event) => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // 檢查本地存儲中的深色模式設置
    if (localStorage.getItem('darkMode') === 'enabled') {
      body.classList.add('dark-mode');
    }
  
    darkModeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      
      // 更新本地存儲中的設置
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
      } else {
        localStorage.setItem('darkMode', null);
      }
    });
  });

  



app.mount("#layout");


