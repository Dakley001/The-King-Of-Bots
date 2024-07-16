import { createRouter, createWebHistory } from 'vue-router';
import PkIndexView from '@/views/pk/PkIndexView.vue';
import RanklistIndexView from '@/views/ranklist/RanklistIndexView.vue';
import RecordIndexView from '@/views/record/RecordIndexView.vue';
import UserBotIndexView from '@/views/user/bots/UserBotIndexView.vue';
import NotFoundView from '@/views/error/NotFoundView.vue';
import UserAccountLoginView from '@/views/user/account/UserAccountLoginView.vue';
import UserAccountRegisterView from '@/views/user/account/UserAccountRegisterView.vue';

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/pk/",
  },
  {
    path: "/pk/",
    name: "pk_index",
    component: PkIndexView,
  },
  {
    path: "/ranklist/",
    name: "ranklist_index",
    component: RanklistIndexView,
  },
  {
    path: "/record/",
    name: "record_index",
    component: RecordIndexView,
  },
  {
    path: "/user/bot/",
    name: "user_bot_index",
    component: UserBotIndexView,
  },
  {
    path: "/user/account/login/",
    name: "user_account_login",
    component: UserAccountLoginView,
  },
  {
    path: "/user/account/register/",
    name: "user_account_register",
    component: UserAccountRegisterView,
  },
  {
    path: "/404/",
    name: "404",
    component: NotFoundView,
  },
  {
    path: "/:catchAll(.*)",
    name: "other_404",
    redirect: "/404/",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
