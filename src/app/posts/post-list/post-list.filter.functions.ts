import { PostFilters } from "./post-list.filter.model";

export function removeFilterItems() {
    localStorage.removeItem('isUserFiltered');
    localStorage.removeItem('isTextFiltered');
    localStorage.removeItem('textSearch');
}

export function updateFilterUserId(value: boolean, postFilters : PostFilters) {
  saveBooleanItem('isUserFiltered', value);
  const userId = getItem('userId');
  postFilters.userid = (userId && value) ? userId : "";
}

export function updateFilterText(value: boolean, text: string, postFilters : PostFilters) {
  saveBooleanItem('isTextFiltered', value);
  saveItem('textSearch', text);
  postFilters.text = (text && value) ? text : "";
}

export function getItem(item : string) : string {
  const text = localStorage.getItem(item);
  return (text) ? text : "";
}

export function getBooleanItem(item : string) : boolean {
  return getItem(item) === 'true' ? true : false;
}

export function saveBooleanItem(item : string, flag: boolean) {
  localStorage.setItem(item, flag + "");
}

function saveItem(item : string, value: string) {
  localStorage.setItem(item, value);
}


