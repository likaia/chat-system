<template>
  <div class="feed-back">
    <div class="feed-banner"></div>
    <div class="feed-content">
      <div class="feed-content-left">
        <div class="feed-problem">
          <div class="classify_body">
            <div class="title_tab">
              <div class="title_list">
                常见问题
              </div>
              <div class="title_all">全部</div>
            </div>
            <div class="classify_content">
              <div class="pc_home_pro_list pro_list">
                <ul>
                  <li class="item">
                    <a target="_blank"
                      ><span class="item_font">修改字体失效</span
                      ><svg
                        class="tcIcon tcIcon_hot tcIcon_faq_hot"
                        viewBox="0 0 10 13"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.658 0c.039.32.018.646-.028.964a5.32 5.32 0 01-.837 2.099A7.374 7.374 0 011.49 4.536a3.97 3.97 0 00-.798.92 4.403 4.403 0 00-.633 1.68 5.004 5.004 0 00.054 1.822c.315 1.488 1.267 2.809 2.54 3.539.21.118.425.233.652.312-.103-.413-.24-.817-.325-1.236-.115-.54-.18-1.102-.099-1.653.06-.41.216-.81.48-1.123.038-.042.07-.094.122-.12.126.61.277 1.218.51 1.793.268.671.644 1.305 1.154 1.803.305.3.66.543 1.038.727.176-.076.342-.177.506-.277a9.114 9.114 0 001.07-.78c.58-.493 1.11-1.061 1.517-1.722.429-.692.708-1.5.72-2.332.022-.869-.243-1.722-.65-2.47-.389-.713-.896-1.347-1.45-1.923-.03-.033-.06-.067-.099-.087-.025.123-.035.248-.05.373-.06.56-.133 1.123-.281 1.666-.102.36-.23.724-.46 1.017-.156.202-.39.348-.643.345.167-1.136.196-2.31-.051-3.436-.18-.817-.524-1.607-1.065-2.23A4.304 4.304 0 003.658 0z"
                          fill="#EF5656"
                          fill-rule="nonzero"
                        ></path></svg
                    ></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="post_list_label">
          <div class="label_list" role="tablist">
            <a
              role="tab"
              aria-selected="true"
              class="label_list__item label_list__item--native"
              href="#label=default"
              >推荐</a
            ><a
              role="tab"
              aria-selected="false"
              class="label_list__item"
              href="#label=show"
              >最新</a
            >
          </div>
        </div>
        <ul class="comment-ul">
          <li class="comment-li" v-for="v in 6">
            <div class="user_avatar">
              <a target="_blank" rel="noreferrer" class="avatar__link">
                <img
                  class="avatar_img"
                  src="../../assets/img/login/LoginWindow_BigDefaultHeadImage@2x.png"
                />
              </a>
            </div>
            <div class="item_content">
              <div class="user_info">
                <a target="_blank" class="user_name" rel="noreferrer">andy</a>
                <div class="public_time">2019年01月24日 10:47</div>
                <div class="type_label"></div>
              </div>
              <div class="desc_para">
                qq无法登录，手机验证设备一直显示验证失败。
              </div>
              <div class="post_operations">
                <div class="btns_style_pc">
                  <div
                    class="btn btn-like"
                    role="button"
                    tabindex="0"
                    aria-label="2赞 "
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 1 20 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="tcIcon tcIcon_likes"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.141 2.542a2.399 2.399 0 014.335 1.81L13.065 6.5h2.76a2.499 2.499 0 012.423 3.104l-1.252 5.004a2.497 2.497 0 01-2.422 1.892H5.833a.836.836 0 01-.836-.836v-7.99c0-.219.086-.427.238-.584l1.09-.795c1.312-.956 2.194-2.254 2.816-3.753zm2.544.89a.737.737 0 00-1.095-.04c-.794 1.828-1.869 3.22-3.282 4.25l-.644.47v6.721h7.91c.381 0 .712-.259.805-.63L16.63 9.2a.818.818 0 00-.15-.712.82.82 0 00-.655-.32h-4.776l.379-1.98.411-2.15a.721.721 0 00-.154-.604zM1.666 8.168a.833.833 0 111.667 0v7.5a.833.833 0 11-1.667 0v-7.5z"
                        fill="#697596"
                      ></path></svg
                    ><span class="btn-text">2</span>
                  </div>
                  <div class="btn btn-comment" role="button" tabindex="0">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="tcIcon tcIcon_chat"
                    >
                      <path
                        fill="#fff"
                        fill-opacity=".01"
                        d="M0 0h20v20H0z"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M18 6.502C18 5.12 16.858 4 15.45 4H4.55C3.14 4 2 5.12 2 6.502v11.664c0 .168.051.331.148.47a.86.86 0 001.18.219l3.25-2.506h8.872c1.408 0 2.55-1.12 2.55-2.502V6.502zM4.375 5.5h11.25l.102.006c.435.048.773.403.773.834V14l-.006.098a.863.863 0 01-.87.742h-9.73L3.5 16.753V6.34l.006-.098a.863.863 0 01.869-.742z"
                        fill="#697596"
                      ></path></svg
                    ><span class="btn-text">5</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="feed-content-right">
        <div class="side-info">
          <ul class="info">
            <li>
              <p class="num">0</p>
              <p class="text">被赞同</p>
            </li>
            <li>
              <p class="num">0</p>
              <p class="text">问题</p>
            </li>
            <li>
              <p class="num">2</p>
              <p class="text">提问</p>
            </li>
          </ul>
          <button class="post_button" @click="visibleModal(true)">
            我要发言
          </button>
        </div>
        <div class="power_by">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 26 38"
            class="tcIcon_logo"
          >
            <defs>
              <linearGradient
                x1="63.932%"
                y1="-9.429%"
                x2="50.275%"
                y2="97.473%"
                id="a"
              >
                <stop stop-color="#FFF" offset="0%"></stop>
                <stop stop-color="#3269FF" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="69.847%"
                y1="-9.43%"
                x2="50.392%"
                y2="97.473%"
                id="b"
              >
                <stop stop-color="#FFF" offset="0%"></stop>
                <stop stop-color="#3269FF" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g fill="none">
              <path
                d="M0 10.498a2.722 2.722 0 012.722-2.722h19.18a2.722 2.722 0 012.722 2.722v18.035a2.722 2.722 0 01-2.722 2.721H6.347l-4.409 5.5A1.089 1.089 0 010 36.074V10.497z"
                fill="#2378FF"
              ></path>
              <path
                d="M11.068 14.304c4.428-5.018 8.343-9.72 11.746-14.106.872-1.193.54 3.331-.29 4.812-.83 1.48-2.657 5.017-8.675 8.923-4.012 2.605-4.939 2.728-2.78.37z"
                fill="url(#a)"
              ></path>
              <path
                d="M25.069 4.574a14.36 14.36 0 01-2.246 4.498H17.28c3.03-2.924 6.38-6.326 8.26-8.463a1.4 1.4 0 01.028-.032l.015-.016c.252-.26.817-.583-.514 4.013z"
                fill="url(#b)"
              ></path>
              <path
                d="M25.056 4.263c-1.656 4.842-5.795 9.047-10.39 10.024 0 0 2.11.892 2.608 1.996.318.71 1.49 1.893 3.515 3.553.05.04 1.396.603 4.04 1.687v7.564a2.45 2.45 0 01-2.45 2.449H16.68l-2.967-6.502c-.717-.68-1.504-1.02-2.36-1.02-.272 0-.6.01-.96.011h-.155c-1.314-.005-2.984-.149-3.893-1.243-.8-.962-1.187-1.713-1.16-2.25.635-.794 1.022-1.46 1.16-1.997.207-.807 1.655-2.719 2.649-3.271s1.16-.85 1.946-.85S21.536 4.586 25.305.143c.211-.249 1.407-.722-.249 4.12z"
                fill="#FFF"
              ></path>
              <path
                fill="#2378FF"
                d="M10.152 17.28a1.08 1.08 0 100 2.16 1.08 1.08 0 100-2.16z"
              ></path>
            </g>
          </svg>
          <a href="#" class="power_by_link" target="_blank">Powered by</a>
          <div class="power_by__inform">
            <span class="power_by__inform_symbol">·</span
            ><a href="#" class="power_by_link" target="_blank">腾讯兔小巢</a>
          </div>
        </div>
      </div>
    </div>
    <div class="mask" v-show="agreementVisible"></div>
    <div class="modal" v-show="agreementVisible">
      <div class="modal-content">
        <div
          class="modal-close"
          role="button"
          tabindex="0"
          @click="visibleModal(false)"
        >
          <svg
            class="tcIcon tcIcon_shut"
            viewBox="0 0 80 80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.333 62.107c1.812 1.816 3.588 1.776 5.325-.12L39.72 45.165 56.782 61.99c1.737 1.892 3.513 1.932 5.325.12 1.816-1.816 1.776-3.592-.12-5.329L45.165 39.72l16.822-17.062c1.896-1.737 1.936-3.513.12-5.325-1.812-1.816-3.588-1.776-5.325.12L39.72 34.275 22.658 17.453c-1.737-1.896-3.513-1.936-5.325-.12-1.816 1.812-1.776 3.588.12 5.325L34.275 39.72 17.453 56.782c-1.896 1.737-1.936 3.513-.12 5.325z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div class="user-login-modal">
          <div class="login-panel">
            <div class="mod-agreement">
              <div class="mod-agreement-title">
                请阅读并同意<span
                  class="mod-agreement-span"
                  role="button"
                  tabindex="0"
                  >《用户协议》</span
                >与<span class="mod-agreement-span" role="button" tabindex="0"
                  >《隐私协议》</span
                >
              </div>
              <div
                title="腾讯兔小巢平台用户服务协议"
                class="mod-agreement-content"
              >
                <feedAgreement />
              </div>
              <div>
                <button class="mod-agreement-btn">我已阅读并同意</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import feedAgreement from "./feed-agreement.vue";

export default defineComponent({
  name: "feed_back",
  props: {},
  components: {
    feedAgreement
  },
  data() {
    return {
      currentIndex: 0,
      agreementVisible: false
    };
  },
  methods: {
    visibleModal(flag: boolean) {
      this.agreementVisible = flag;
    }
  }
});
</script>

<style
  scoped
  lang="scss"
  src="@/assets/scss/moreListChild/feed-back.scss"
></style>
