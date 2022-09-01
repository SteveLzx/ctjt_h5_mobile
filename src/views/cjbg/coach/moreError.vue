<template>
  <div >
    <div class="content">
      <div class="query_content">
        <van-cell-group class="cell_picker" inset>
          <van-field
            v-model="picker.value.text"
            class="field_style"
            disabled
            clickable
            name="picker"
            placeholder="筛选项目"
            right-icon="arrow-down"
            clearable
            clear-trigger="always"
            @click="handlePicker"
            @clear="handlePickerClear"
          />
          <van-popup v-model:show="picker.showPicker" position="bottom">
            <van-picker
              :columns="options"
              @confirm="onConfirm"
              @cancel="picker.showPicker = false"
            />
          </van-popup>
        </van-cell-group>
        <van-cell-group class="cell_tab" inset>
          <div v-for="(tab, index) in tabList" :key="index"
            :class="['tab_style',tab.name === activeTab && 'active_tab' ]"
            @click="handleTab(tab.name)">{{tab.title}}</div>
        </van-cell-group>
      </div>
      <div class="list_content">
        <van-pull-refresh v-model="list.refreshing" @refresh="onListRefresh">
          <van-list
            v-model:loading="list.loading"
            :finished="list.finished"
            finished-text="没有更多了"
            @load="onListLoad"
          >
            <div class="card_style" v-for="(item, index) in list.data" :key="index">
              <div class="cell cell_header">
                {{item.projectName}} - {{item.itemName}}
              </div>
              <div class="cell">
                <div class="cell_title">错误描述</div>
                <div class="cell_text">
                  <div>{{item.errorContent}}</div>
                </div>
              </div>
              <div class="cell">
                <div class="cell_title">错误原因</div>
                <div class="cell_text">
                  <div v-for="(mistakeReason, key) in getSpiltList(item.mistakeReason)" :key="key">{{mistakeReason}}</div>
                </div>
              </div>
              <div class="cell">
                <div class="cell_title">解决措施</div>
                <div class="cell_text">
                  <div v-for="(solution, key) in getSpiltList(item.solutions)" :key="key">{{solution}}</div>
                </div>
              </div>
              <div class="cell">
                <div class="cell_title">错误时间</div>
                <div class="cell_text">{{item.lastEventDt}}</div>
                <div class="error_time" v-if="item.totalErrorTimes">错误次数: {{item.totalErrorTimes}}次</div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue';
import {
  CellGroup,
  Field,
  Popup,
  Picker,
  DatetimePicker,
  Grid,
  GridItem,
  PullRefresh,
  List
} from 'vant';
import {
  verifyLogin, setBanBanTitle, getYMD, getQueryString
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';
import { queryMistakes, queryProjectLevel } from './api';

// 排序tab列表
const tabList = [{
  title: '时间倒序',
  name: 1,
}, {
  title: '错误频次',
  name: 2,
}];

interface Option {
  text: string|number;
  value: string|number;
}
export default {
  setup() {
    setBanBanTitle('更多错误分析');

    // 初始化下拉选择器
    const picker = reactive({
      value: {
        text: '',
        value: -1
      },
      showPicker: false,
    });

    // 初始化排序tab
    const activeTab = ref(1);

    const options = ref([]);

    // 初始化查询选项
    let query = reactive({
      current: 1,
      orderBy: 1,
      pageSize: 10,
      projectLevel: -1,
      trainingPlaceId: getQueryString('trainingPlaceId'),
      userId: getQueryString('userId')
    });

    // 初始化卡片列表
    const list = reactive({
      data: [],
      loading: false,
      finished: false,
      refreshing: false,
    });

    // 打开下拉选择器弹窗
    const handlePicker = () => {
      picker.showPicker = true;
    };

    // 调用接口
    const queryMistakesApi = async (reqData: any) => {
      list.loading = true;
      const res: any = await queryMistakes(reqData);
      const {
        current = 1,
        data = []
      } = res || {};
      query = {
        ...query,
        current,
      };
      list.data = list.data.concat(data);
      list.loading = false;
      list.refreshing = false;
      if (!data || (data && data.length < query.pageSize)) {
        list.finished = true;
      }
    };

    // 查询下拉选项
    const queryProjectLevelApi = async () => {
      const queryLevel: any = {
        userId: getQueryString('userId')
      };
      const res: any = await queryProjectLevel(queryLevel);
      options.value = res.map((item: any) => ({
        ...item,
        text: item.projectName,
        value: item.projectLevel
      }));
    };

    // 下拉选择器确认操作
    const onConfirm = (value: Option) => {
      picker.value = { ...value };
      picker.showPicker = false;
      query = {
        ...query,
        current: 1,
        projectLevel: value.value
      };
      list.data = [];
      list.finished = false;
      queryMistakesApi(query);
    };

    // 清除下拉选择数据
    const handlePickerClear = () => {
      query = {
        ...query,
        current: 1,
        projectLevel: -1
      };
      list.data = [];
      list.finished = false;
      queryMistakesApi(query);
    };

    // 排序tab切换
    const handleTab = (tabName: string|number) => {
      activeTab.value = tabName;
      query = {
        ...query,
        current: 1,
        orderBy: tabName
      };
      list.data = [];
      list.finished = false;
      queryMistakesApi(query);
    };

    // 下拉刷新
    const onListRefresh = () => {
      query = {
        ...query,
        current: 1,
      };
      list.data = [];
      list.finished = false;
      queryMistakesApi(query);
    };

    // 滑动分页请求
    const onListLoad = () => {
      query = {
        ...query,
        current: query.current + 1
      };
      queryMistakesApi(query);
    };

    const init = () => {
      query = {
        ...query,
      };
      queryMistakesApi(query);
      queryProjectLevelApi();
    };
    init();

    const getSpiltList = (text = '') => text && text.split('###');

    return {
      picker,
      options,
      onConfirm,
      handlePicker,
      activeTab,
      tabList,
      handleTab,
      list,
      onListRefresh,
      onListLoad,
      handlePickerClear,
      getSpiltList
    };
  },
  components: {
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [DatetimePicker.name]: DatetimePicker,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
  }
};

</script>

<style lang="less" scoped>
.content{
  background: #f3f4fb;
  min-height: 100vh;
  .query_content{
    padding: 0.48rem 0rem 0.4rem;
    background: #fff;
    position: fixed;
    z-index: 100;
    width: 100%;
    box-shadow: 0px 12px 24px -8px #eee;
    .cell_picker{
      margin-bottom: 0.32rem;
    }
    .field_style{
      background: #F6F6F6;
      /deep/ .van-field__control:disabled{
        color: #000;
        -webkit-text-fill-color: #000;
      }
    }
    .cell_tab{
      display: flex;
      border: 1px solid #F5F5F5;
      height: 0.84rem;
      line-height: 0.84rem;
      text-align: center;
      font-size: 32px;
      .tab_style{
        width: 50%;
      }
      .active_tab{
        background: #3DB871;
        color: #fff;
      }
    }
  }
  .list_content{
    padding: 3.24rem 0.24rem 0.24rem;
    .card_style{
      border-radius: 0.08rem;
      background: #fff;
      font-size: 28px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 0.01rem solid #e5e5e5;
      &:not(:last-child){
        margin-bottom: 0.24rem;
      }
      .cell{
        display: flex;
        align-items: stretch;
        &:not(:last-child){
          border-bottom: 2px solid #e5e5e5;
        }
        .cell_title{
          width: 20%;
          min-width: 20%;
          background: #EEFFF6;
          text-align: center;
          padding: 0.26rem 0.16rem;
        }
        .cell_text{
          padding: 0.26rem 0.16rem;
          flex: auto;
          word-break: break-all;
        }
        .late{
          color: #3DB871;
          border-left: 1px solid #e5e5e5;
          padding: 0.26rem 0.16rem;
          white-space: nowrap;
        }
        .error_time{
          color: #3DB871;
          border-left: 1px solid #e5e5e5;
          padding: 0.26rem 0.16rem;
          white-space: nowrap;
        }
      }
      .cell_header{
        height: 0.84rem;
        line-height: 0.84rem;
        justify-content: center;
        background: #D4F2E2;
      }
    }
  }
}

</style>
