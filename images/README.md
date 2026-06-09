# images/ — 사진 폴더

일정·스폿 카드에 띄울 사진을 여기에 넣습니다.

## 사용법
1. 사진 파일(`.jpg`, `.png`, `.webp`, `.svg`)을 이 폴더에 넣습니다. 예: `images/kiyomizu.jpg`
2. `data/schedule.csv`(또는 `data/spots.csv`)의 **`image_url`** 칸에 경로를 적습니다.
   - 레포 안 파일: `images/kiyomizu.jpg`
   - 외부 주소: `https://.../photo.jpg` 도 가능
3. 커밋·푸시하면 카드에 썸네일이 뜨고, 누르면 크게 보입니다.

- `image_url`이 비어 있으면 썸네일은 **표시되지 않습니다**(레이아웃 영향 없음).
- 로딩 실패한 이미지는 자동으로 숨겨집니다.
- 권장: 가로 사진, 너비 800px 내외(폰 우선이라 너무 크지 않게).
