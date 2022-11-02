interface ObjType {
  [key: string]: string
}

const StatusNameList: ObjType = {
  RECRUITING: '모집중',
  CONFIRM: '확정',
  DELIVERING: '배송중',
  DELIVERED: '배송완료',
  DISTRIBUTING: '배분중',
  COMPLETED: '배분완료',
  CANCELED: '취소',
  UNDER_DELIBERATION: '심의중',
};

export default StatusNameList;
