import { Injectable, signal } from '@angular/core';
import { Language } from '../models/mobile-post-office.model';
import { Subject } from 'rxjs';

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  // 當前語言
  private currentLanguage = signal<Language>(this.getStoredLanguage());

  // Language change event observable
  languageChange$ = new Subject<Language>();

  private getStoredLanguage(): Language {
    const stored = localStorage.getItem('selectedLanguage');
    return (stored as Language) || 'en';
  }

  // 可用語言選項
  readonly availableLanguages: LanguageOption[] = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'tc', label: 'Traditional Chinese', nativeLabel: '繁體中文' },
    { code: 'sc', label: 'Simplified Chinese', nativeLabel: '简体中文' },
  ];

  // 翻譯字典
  private translations: Record<Language, Record<string, string>> = {
    en: {
      'app.title': 'Mobile Post Office',
      'nav.home': 'Home',
      'nav.list': 'List',
      'nav.create': 'Create New',
      'search.placeholder': 'Search by name, location or address...',
      'filter.district': 'District',
      'filter.dayOfWeek': 'Day of Week',
      'filter.openAt': 'Open At',
      'filter.clear': 'Clear Filters',
      'filter.apply': 'Apply',
      'filter.showAllLang': 'Show all language data',
      'sort.by': 'Sort By',
      'sort.direction': 'Sort Direction',
      'sort.id': 'ID',
      'sort.seq': 'Sequence',
      'sort.name': 'Name',
      'sort.district': 'District',
      'sort.dayOfWeek': 'Day of Week',
      'sort.openAt': 'Opening Time',
      'sort.closeAt': 'Closing Time',
      'sort.asc': 'Ascending',
      'sort.desc': 'Descending',
      'list.noData': 'No records found',
      'list.loading': 'Loading...',
      'detail.id': 'ID',
      'detail.seq': 'Sequence',
      'detail.name': 'Name',
      'detail.district': 'District',
      'detail.location': 'Location',
      'detail.address': 'Address',
      'detail.openAt': 'Opening Time',
      'detail.closeAt': 'Closing Time',
      'detail.dayOfWeek': 'Day of Week',
      'detail.back': 'Back to List',
      'detail.edit': 'Edit',
      'detail.delete': 'Delete',
      'form.create': 'Create New Record',
      'form.edit': 'Edit Record',
      'form.name': 'Name',
      'form.district': 'District',
      'form.location': 'Location',
      'form.address': 'Address',
      'form.openAt': 'Opening Time',
      'form.closeAt': 'Closing Time',
      'form.dayOfWeek': 'Day of Week',
      'form.submit': 'Submit',
      'form.cancel': 'Cancel',
      'form.required': 'This field is required',
      'form.timeFormat': 'Time format should be HH:mm',
      'form.timeRange': 'Closing time must be after opening time',
      'message.createSuccess': 'Record created successfully',
      'message.updateSuccess': 'Record updated successfully',
      'message.deleteSuccess': 'Record deleted successfully',
      'message.error': 'An error occurred',
      'confirm.delete': 'Are you sure you want to delete this record?',
      'confirm.yes': 'Yes',
      'confirm.no': 'No',
      'pagination.itemsPerPage': 'Items per page',
      'pagination.of': 'of',
      'day.monday': 'Monday',
      'day.tuesday': 'Tuesday',
      'day.wednesday': 'Wednesday',
      'day.thursday': 'Thursday',
      'day.friday': 'Friday',
      'day.saturday': 'Saturday',
      'day.sunday': 'Sunday',
    },
    tc: {
      'app.title': '流動郵政局',
      'nav.home': '首頁',
      'nav.list': '列表',
      'nav.create': '新增',
      'search.placeholder': '依名稱、地點或地址搜尋...',
      'filter.district': '地區',
      'filter.dayOfWeek': '星期',
      'filter.openAt': '營業時段',
      'filter.clear': '清除篩選',
      'filter.apply': '套用',
      'filter.showAllLang': '顯示所有語言資料',
      'sort.by': '排序依據',
      'sort.direction': '排序方向',
      'sort.id': 'ID',
      'sort.seq': '順序',
      'sort.name': '名稱',
      'sort.district': '地區',
      'sort.dayOfWeek': '星期',
      'sort.openAt': '開放時間',
      'sort.closeAt': '關閉時間',
      'sort.asc': '升序',
      'sort.desc': '降序',
      'list.noData': '找不到記錄',
      'list.loading': '載入中...',
      'detail.id': 'ID',
      'detail.seq': '順序',
      'detail.name': '名稱',
      'detail.district': '地區',
      'detail.location': '地點',
      'detail.address': '地址',
      'detail.openAt': '開放時間',
      'detail.closeAt': '關閉時間',
      'detail.dayOfWeek': '星期',
      'detail.back': '返回列表',
      'detail.edit': '編輯',
      'detail.delete': '刪除',
      'form.create': '新增記錄',
      'form.edit': '編輯記錄',
      'form.name': '名稱',
      'form.district': '地區',
      'form.location': '地點',
      'form.address': '地址',
      'form.openAt': '開放時間',
      'form.closeAt': '關閉時間',
      'form.dayOfWeek': '星期',
      'form.submit': '提交',
      'form.cancel': '取消',
      'form.required': '此欄位為必填',
      'form.timeFormat': '時間格式應為 HH:mm',
      'form.timeRange': '關閉時間必須晚於開放時間',
      'message.createSuccess': '記錄新增成功',
      'message.updateSuccess': '記錄更新成功',
      'message.deleteSuccess': '記錄刪除成功',
      'message.error': '發生錯誤',
      'confirm.delete': '確定要刪除此記錄嗎?',
      'confirm.yes': '是',
      'confirm.no': '否',
      'pagination.itemsPerPage': '每頁項目數',
      'pagination.of': '共',
      'day.monday': '星期一',
      'day.tuesday': '星期二',
      'day.wednesday': '星期三',
      'day.thursday': '星期四',
      'day.friday': '星期五',
      'day.saturday': '星期六',
      'day.sunday': '星期日',
    },
    sc: {
      'app.title': '流动邮政局',
      'nav.home': '首页',
      'nav.list': '列表',
      'nav.create': '新增',
      'search.placeholder': '依名称、地点或地址搜索...',
      'filter.district': '地区',
      'filter.dayOfWeek': '星期',
      'filter.openAt': '营业时段',
      'filter.clear': '清除筛选',
      'filter.apply': '应用',
      'filter.showAllLang': '显示所有语言资料',
      'sort.by': '排序依据',
      'sort.direction': '排序方向',
      'sort.id': 'ID',
      'sort.seq': '顺序',
      'sort.name': '名称',
      'sort.district': '地区',
      'sort.dayOfWeek': '星期',
      'sort.openAt': '开放时间',
      'sort.closeAt': '关闭时间',
      'sort.asc': '升序',
      'sort.desc': '降序',
      'list.noData': '找不到记录',
      'list.loading': '载入中...',
      'detail.id': 'ID',
      'detail.seq': '顺序',
      'detail.name': '名称',
      'detail.district': '地区',
      'detail.location': '地点',
      'detail.address': '地址',
      'detail.openAt': '开放时间',
      'detail.closeAt': '关闭时间',
      'detail.dayOfWeek': '星期',
      'detail.back': '返回列表',
      'detail.edit': '编辑',
      'detail.delete': '删除',
      'form.create': '新增记录',
      'form.edit': '编辑记录',
      'form.name': '名称',
      'form.district': '地区',
      'form.location': '地点',
      'form.address': '地址',
      'form.openAt': '开放时间',
      'form.closeAt': '关闭时间',
      'form.dayOfWeek': '星期',
      'form.submit': '提交',
      'form.cancel': '取消',
      'form.required': '此字段为必填',
      'form.timeFormat': '时间格式应为 HH:mm',
      'form.timeRange': '关闭时间必须晚于开放时间',
      'message.createSuccess': '记录新增成功',
      'message.updateSuccess': '记录更新成功',
      'message.deleteSuccess': '记录删除成功',
      'message.error': '发生错误',
      'confirm.delete': '确定要删除此记录吗?',
      'confirm.yes': '是',
      'confirm.no': '否',
      'pagination.itemsPerPage': '每页项目数',
      'pagination.of': '共',
      'day.monday': '星期一',
      'day.tuesday': '星期二',
      'day.wednesday': '星期三',
      'day.thursday': '星期四',
      'day.friday': '星期五',
      'day.saturday': '星期六',
      'day.sunday': '星期日',
    },
    all: {
      'app.title': 'Mobile Post Office / 流動郵政局 / 流动邮政局',
      'nav.home': 'Home / 首頁 / 首页',
      'nav.list': 'List / 列表 / 列表',
      'nav.create': 'Create / 新增 / 新增',
      'search.placeholder': 'Search / 搜尋 / 搜索...',
      'filter.district': 'District / 地區 / 地区',
      'filter.dayOfWeek': 'Day / 星期 / 星期',
      'filter.openAt': 'Open At / 營業時段 / 营业时段',
      'filter.clear': 'Clear / 清除 / 清除',
      'filter.apply': 'Apply / 套用 / 应用',
      'filter.showAllLang': 'Show all language data / 顯示所有語言資料 / 显示所有语言资料',
      'sort.by': 'Sort / 排序 / 排序',
      'sort.direction': 'Direction / 方向 / 方向',
      'sort.id': 'ID / ID / ID',
      'sort.seq': 'Seq / 順序 / 顺序',
      'sort.name': 'Name / 名稱 / 名称',
      'sort.district': 'District / 地區 / 地区',
      'sort.dayOfWeek': 'Day of Week / 星期 / 星期',
      'sort.openAt': 'Open Time / 開放時間 / 开放时间',
      'sort.closeAt': 'Close Time / 關閉時間 / 关闭时间',
      'sort.asc': 'Asc / 升序 / 升序',
      'sort.desc': 'Desc / 降序 / 降序',
      'list.noData': 'No records / 找不到記錄 / 找不到记录',
      'list.loading': 'Loading / 載入中 / 载入中...',
      'detail.id': 'ID / ID / ID',
      'detail.seq': 'Seq / 順序 / 顺序',
      'detail.name': 'Name / 名稱 / 名称',
      'detail.district': 'District / 地區 / 地区',
      'detail.location': 'Location / 地點 / 地点',
      'detail.address': 'Address / 地址 / 地址',
      'detail.openAt': 'Open / 開放 / 开放',
      'detail.closeAt': 'Close / 關閉 / 关闭',
      'detail.dayOfWeek': 'Day / 星期 / 星期',
      'detail.back': 'Back / 返回 / 返回',
      'detail.edit': 'Edit / 編輯 / 编辑',
      'detail.delete': 'Delete / 刪除 / 删除',
      'form.create': 'Create / 新增 / 新增',
      'form.edit': 'Edit / 編輯 / 编辑',
      'form.name': 'Name / 名稱 / 名称',
      'form.district': 'District / 地區 / 地区',
      'form.location': 'Location / 地點 / 地点',
      'form.address': 'Address / 地址 / 地址',
      'form.openAt': 'Open / 開放 / 开放',
      'form.closeAt': 'Close / 關閉 / 关闭',
      'form.dayOfWeek': 'Day / 星期 / 星期',
      'form.submit': 'Submit / 提交 / 提交',
      'form.cancel': 'Cancel / 取消 / 取消',
      'form.required': 'Required / 必填 / 必填',
      'form.timeFormat': 'Format: HH:mm / 格式 / 格式',
      'form.timeRange': 'Invalid time range / 時間範圍錯誤 / 时间范围错误',
      'message.createSuccess': 'Created / 已新增 / 已新增',
      'message.updateSuccess': 'Updated / 已更新 / 已更新',
      'message.deleteSuccess': 'Deleted / 已刪除 / 已删除',
      'message.error': 'Error / 錯誤 / 错误',
      'confirm.delete': 'Delete? / 刪除? / 删除?',
      'confirm.yes': 'Yes / 是 / 是',
      'confirm.no': 'No / 否 / 否',
      'pagination.itemsPerPage': 'Per page / 每頁 / 每页',
      'pagination.of': 'of / 共 / 共',
    },
  };

  /**
   * 取得當前語言
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage();
  }

  /**
   * 設定當前語言
   */
  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    localStorage.setItem('selectedLanguage', lang);
    this.languageChange$.next(lang);
  }

  /**
   * 取得翻譯文字
   */
  translate(key: string, lang?: Language): string {
    const language = lang || this.currentLanguage();
    return this.translations[language]?.[key] || key;
  }

  /**
   * 取得當前語言的所有翻譯
   */
  getTranslations(lang?: Language): Record<string, string> {
    const language = lang || this.currentLanguage();
    return this.translations[language] || {};
  }
}
