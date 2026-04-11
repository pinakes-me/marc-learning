const writeQuestions = [
  {
    id: 1,
    title: "표제 및 책임표시사항을 입력하세요",
    field: "245",
    indicators: "00",
    hint: "$a 표제 / $x 대등표제 / $d 첫번째 저자, $e 두번째 저자, $e 세번째 저자 공저",
    blanks: [
      { label: "입력", answer: "$a 디지털 인문학 입문 =" },
      { label: "입력", answer: "$x Digital humanities /" },
      { label: "입력", answer: "$d 김현, $e 임영상, $e 김바로 공저" },
    ]
  },
  {
    id: 2,
    title: "발행사항을 입력하세요 (발행처 2개)",
    field: "260",
    indicators: "  ",
    hint: "$a 발행지 / $b 발행처 (여러개 가능) / $c 발행연도",
    blanks: [
      { label: "입력", answer: "$a 서울 :" },
      { label: "입력", answer: "$b Huebooks :" },
      { label: "입력", answer: "$b 한국외국어대학교 지식출판원," },
      { label: "입력", answer: "$c 2016" },
    ]
  },
  {
    id: 3,
    title: "형태사항을 입력하세요",
    field: "300",
    indicators: "  ",
    hint: "$a 페이지수 / $b 삽화사항 / $c 크기",
    blanks: [
      { label: "입력", answer: "$a 510 p. :" },
      { label: "입력", answer: "$b 삽화, 도표, 초상 ;" },
      { label: "입력", answer: "$c 23 cm" },
    ]
  },
  {
    id: 4,
    title: "주제명 부출표목을 입력하세요",
    field: "650",
    indicators: " 8",
    hint: "$a 주제명",
    blanks: [
      { label: "입력", answer: "$a 인문 과학" },
    ]
  },
  {
    id: 5,
    title: "부출표목(공저자)을 입력하세요 (첫번째 저자)",
    field: "700",
    indicators: "1 ",
    hint: "$a 성명",
    blanks: [
      { label: "입력", answer: "$a 김현" },
    ]
  },
  {
    id: 6,
    title: "국제표준도서번호를 입력하세요",
    field: "020",
    indicators: "  ",
    hint: "$a ISBN 번호",
    blanks: [
      { label: "입력", answer: "$a 9791159010873" },
    ]
  },
]

export default writeQuestions
