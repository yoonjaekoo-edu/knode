export const randomPagePools = {
  everyday: [
    "비둘기","고양이","개","햄스터","토끼","달팽이","문어","펭귄","기린","코끼리","상어","독수리","개미","나비","꿀벌","사과","바나나","수박","딸기","감자","고구마","김치","라면","떡볶이","피자","햄버거","초콜릿","아이스크림","커피","우유","치즈","빵","쌀","소금","설탕","우산","연필","지우개","가위","자전거","버스","택시","지하철","엘리베이터","냉장고","세탁기","전자레인지","선풍기","에어컨","칫솔","시계","거울","의자","책상","침대","창문","신발","축구","야구","농구","배드민턴","수영","피아노","기타","바이올린","드럼","사진","영화","만화","게임","체스","종이","풍선","비누","양말","모자","가방","우체국","학교","도서관","공원","병원","공항","기차역"
  ],
  knowledge: [
    "블랙홀","양자역학","상대성이론","미적분학","피타고라스 정리","소수 (수론)","확률","집합론","기하학","통계학","무한","원주율","복소수","행렬","알고리즘","C++","파이썬","리눅스","인터넷","월드 와이드 웹","인공지능","기계 학습","컴퓨터","반도체","트랜지스터","로봇","암호학","DNA","RNA","유전자","진화","광합성","세포","바이러스","세균","뉴런","뇌","심장","산소","탄소","금","우라늄","주기율표","중력","전자","원자","빛","레이저","전기","자기장","태양","달","화성","목성","토성","은하","우주","빅뱅","초신성","혜성","지구","판 구조론","화산","지진","태풍","기후 변화","남극","태평양","에베레스트산","사하라 사막","아마존강","로마 제국","몽골 제국","산업 혁명","프랑스 혁명","제1차 세계 대전","제2차 세계 대전","르네상스","고대 이집트","민주주의","자본주의","철학","논리학","언어학","경제학","심리학","고고학","문자","한글","라틴어","인쇄","증기 기관","전화","라디오","텔레비전","인공위성","국제우주정거장","노벨상","올림픽","유엔","유럽 연합"
  ]
} as const;

const poolEntries = Object.entries(randomPagePools);

export function getRandomPair() {
  const firstPoolIndex = Math.floor(Math.random() * poolEntries.length);
  let secondPoolIndex = Math.floor(Math.random() * poolEntries.length);
  while (secondPoolIndex === firstPoolIndex) secondPoolIndex = Math.floor(Math.random() * poolEntries.length);

  const firstPool = poolEntries[firstPoolIndex][1];
  const secondPool = poolEntries[secondPoolIndex][1];
  const first = firstPool[Math.floor(Math.random() * firstPool.length)];
  const second = secondPool[Math.floor(Math.random() * secondPool.length)];

  return Math.random() < 0.5 ? { start: first, target: second } : { start: second, target: first };
}
