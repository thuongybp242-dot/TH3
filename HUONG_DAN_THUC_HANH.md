# BÁO CÁO & HƯỚNG DẪN THỰC HÀNH: SMART CONTRACT & WEB3 DAPP (PTIT DOMINION DAO)

> **Môn học:** Lập trình Blockchain / Hệ thống phân tán  
> **Dự án:** DominionDAO - Tổ chức tự trị phi tập trung (Decentralized Autonomous Organization)  
> **Mạng triển khai:** Sepolia Testnet (Ethereum)

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN ĐÃ KHỞI TẠO

Toàn bộ mã nguồn theo đúng slide bài giảng của thầy đã được tạo đầy đủ:

```text
blockchain\th3/
├── smartcontract/                    # [BÀI 1] DỰ ÁN SMART CONTRACT (HARDHAT & SOLIDITY)
│   ├── contracts/
│   │   ├── DominionDAO.sol           # Hợp đồng thông minh DAO đầy đủ chức năng
│   │   └── FirstSmartcontract.sol    # Hợp đồng mẫu Set/Get Balance
│   ├── scripts/
│   │   ├── deploy-dominion.js        # Script deploy DominionDAO & tự động xuất ABI sang Frontend
│   │   └── sample-script.js          # Script deploy FirstSmartContract
│   ├── hardhat.config.js             # Cấu hình Hardhat đa compiler (0.7.3 & 0.8.7) + Sepolia network
│   ├── package.json                  # Cấu hình thư viện Hardhat, ethers, waffle
│   └── .env.example                  # Mẫu điền Private Key và RPC URL
│
└── web3-app/                         # [BÀI 2] GIAO DIỆN WEB3 REACT DAPP (PTIT DOMINION)
    ├── public/
    │   └── index.html                # HTML chuẩn Web3 DApp
    ├── src/
    │   ├── abis/
    │   │   └── DominionDAO.json      # File ABI tương tác với Smart Contract
    │   ├── components/
    │   │   ├── Header.jsx            # Thanh điều hướng, đổi Theme Light/Dark, nút Connect Wallet
    │   │   ├── Banner.jsx            # Thống kê quỹ DAO, đóng góp ETH (Contribute), nút Propose
    │   │   ├── CreateProposal.jsx    # Modal tạo đề xuất xin quỹ cho Stakeholders
    │   │   ├── Proposals.jsx         # Bảng danh sách đề xuất (All, Open, Closed), nút Payout
    │   │   ├── ProposalDetails.jsx   # Chi tiết đề xuất + Biểu đồ Recharts kết quả bỏ phiếu
    │   │   └── Voters.jsx            # Danh sách địa chỉ và lịch sử vote của các thành viên
    │   ├── views/
    │   │   ├── Home.jsx              # Trang chủ hiển thị tổng quan và danh sách
    │   │   └── Proposal.jsx          # Trang chi tiết 1 đề xuất kèm danh sách vote
    │   ├── store/
    │   │   └── index.jsx             # Quản lý Global State (react-hooks-global-state)
    │   ├── Blockchain.services.jsx   # Toàn bộ hàm gọi Web3.js kết nối MetaMask & Smart Contract
    │   ├── App.jsx                   # Component gốc định tuyến (React Router v6) & Toast thông báo
    │   ├── index.css                 # CSS Tailwind & font Open Sans chuẩn
    │   └── index.jsx                 # Entrypoint khởi chạy React
    ├── config-overrides.js           # Polyfill Webpack 5 cho thư viện web3
    ├── tailwind.config.js            # Cấu hình giao diện Dark/Light mode, font, hiệu ứng
    ├── postcss.config.js             # Cấu hình PostCSS
    ├── package.json                  # Danh sách dependencies theo đúng tài liệu
    └── .env                          # Chứa biến môi trường REACT_APP_CONTRACT_ADDRESS
```

---

## 🚀 HƯỚNG DẪN TỪNG BƯỚC THỰC HIỆN

### PHẦN 1: CHUẨN BỊ VÍ VÀ NHẬN TESTNET ETH (SEPOLIA)

1. **Cài đặt tiện ích MetaMask trên Chrome:**
   - Cài từ Chrome Web Store: [MetaMask Extension](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
   - Ghim biểu tượng MetaMask vào thanh tiện ích để tiện thao tác.
2. **Tạo / Đăng nhập ví:**
   - Chọn *Tạo ví mới* và lưu trữ cẩn thận **12 từ khóa khôi phục bí mật (Secret Backup Phrase)**.
3. **Bật mạng Sepolia Testnet:**
   - Mở MetaMask -> bấm chọn mạng ở góc trên cùng bên trái -> Chọn **Show test networks** -> Chọn mạng **Sepolia**.
4. **Nhận Sepolia ETH (Faucet miễn phí):**
   - Truy cập: [Google Cloud Web3 Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
   - Chọn mạng: *Ethereum Sepolia*
   - Dán địa chỉ ví MetaMask của bạn vào và nhấn *Receive 0.05 Sepolia ETH*.
   - Hoặc dùng faucet dự phòng: [Sepolia PoW Faucet](https://sepolia-faucet.pk910.de/).

---

### PHẦN 2: TRIỂN KHAI SMART CONTRACT (BÀI 1)

Bạn có thể chọn 1 trong 2 cách triển khai dưới đây:

#### CÁCH 1: Dùng Remix IDE (Đơn giản, trực quan trên web)
1. Truy cập [Remix Ethereum IDE](https://remix.ethereum.org/).
2. Trong thư mục `contracts`, tạo file mới `DominionDAO.sol`.
3. Sao chép toàn bộ mã nguồn từ file [DominionDAO.sol](file:///e:/blockchain\th3/smartcontract/contracts/DominionDAO.sol) vào Remix.
4. Mở tab **Solidity Compiler** (biểu tượng thứ 2 bên trái):
   - Chọn Compiler version: `0.8.7`
   - Bấm **Compile DominionDAO.sol**.
5. Mở tab **Deploy & Run Transactions** (biểu tượng thứ 3 bên trái):
   - Tại mục **Environment**: chọn **Injected Provider - MetaMask**.
   - MetaMask sẽ hiển thị popup, bấm kết nối với tài khoản đang chọn mạng Sepolia.
   - Tại mục **Contract**: chọn `DominionDAO - contracts/DominionDAO.sol`.
   - Bấm nút **Deploy**.
   - Xác nhận giao dịch trên MetaMask và đợi thông báo deploy thành công.
6. Sao chép **Địa chỉ hợp đồng vừa deploy** (mục Deployed Contracts ở góc dưới).

---

#### CÁCH 2: Dùng Hardhat (Dòng lệnh CLI)
1. Mở Terminal và di chuyển vào thư mục `smartcontract`:
   ```bash
   cd smartcontract
   npm install
   ```
2. Mở file `smartcontract/.env.example`, đổi tên thành `.env` và điền Private Key của bạn:
   ```env
   SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
   PRIVATE_KEY=your_private_key_here
   ```
   *(Cách lấy Private key: Mở MetaMask -> Chi tiết tài khoản -> Hiển thị khóa riêng tư -> Nhập mật khẩu ví)*.
3. Biên dịch hợp đồng:
   ```bash
   npx hardhat compile
   ```
4. Deploy hợp đồng lên Sepolia:
   ```bash
   npx hardhat run scripts/deploy-dominion.js --network sepolia
   ```
   Script sẽ tự động deploy và sao chép file ABI sang thư mục `web3-app/src/abis/DominionDAO.json`.

---

### PHẦN 3: CẤU HÌNH & KHỞI CHẠY WEB3 DAPP (BÀI 2)

1. **Cấu hình địa chỉ hợp đồng vào Frontend:**
   - Mở file [web3-app/.env](file:///e:/blockchain\th3/web3-app/.env):
   - Thay thế địa chỉ ví hợp đồng bạn vừa deploy:
     ```env
     REACT_APP_CONTRACT_ADDRESS=0xDiaChiContractVuaDeployCuaBan
     ```
2. **Cài đặt thư viện cho web3-app:**
   - Mở terminal tại thư mục `web3-app`:
     ```bash
     cd web3-app
     npm install --legacy-peer-deps
     ```
3. **Khởi chạy ứng dụng Web3:**
   ```bash
   npm start
   ```
   Trình duyệt sẽ tự động mở trang web tại địa chỉ: `http://localhost:3000`.

---

### PHẦN 4: KỊCH BẢN THỰC HÀNH NHÓM (3 ĐẾN 5 THÀNH VIÊN)

Theo yêu cầu thực hành ở trang 61 của tài liệu:

#### 1. Đóng ETH để trở thành Cổ đông (Stakeholder)
- Từng thành viên trong nhóm kết nối ví MetaMask với DApp.
- Tại màn hình chính, nhập số lượng ETH cần đóng góp (Ví dụ: `0.02` ETH — tối thiểu `>= 0.01` ETH để trở thành Stakeholder).
- Bấm nút **Contribute** và xác nhận trên MetaMask.
- Sau khi giao dịch hoàn tất, số dư DAO Balance cập nhật và giao diện hiển thị: *"You can now raise proposals on this platform 😆"*, kèm nút **Propose** xuất hiện.

#### 2. Tạo Đề xuất (Create Proposal) cho bạn A trong nhóm
- Một thành viên Stakeholder bấm nút **Propose**.
- Điền biểu mẫu:
  - **Title:** Tài trợ nghiên cứu Web3 Nhóm PTIT
  - **Amount:** `0.005` (Số ETH xin trích từ quỹ)
  - **Beneficiary:** Dán địa chỉ ví MetaMask của bạn A (VD: `0x9876...`)
  - **Description:** Xin tài trợ kinh phí thực hành môn học.
- Bấm **Submit Proposal** và xác nhận trên MetaMask.
- Đề xuất sẽ xuất hiện trên danh sách với trạng thái Đang mở (Open).

#### 3. Thực hiện Bỏ phiếu (Vote)
- Các thành viên Stakeholder khác trong nhóm truy cập vào đề xuất vừa tạo (bấm **View**).
- Giao diện hiển thị biểu đồ thống kê phiếu bầu (Recharts).
- Bấm nút **Accept** để đồng ý duyệt chi (hoặc **Reject** để phản đối).
- Xác nhận giao dịch trên MetaMask. Sau khi xong, biểu đồ và số phiếu sẽ tăng lên tương ứng.

#### 4. Chờ hết thời gian và Thực hiện Thanh toán (Payout)
- Thời gian bình chọn được cấu hình tối thiểu là **5 phút** (`MIN_VOTE_DURATION = 5 minutes`).
- Sau 5 phút, khi thời hạn hết (Expires: Expired):
  - Stakeholder bấm vào danh sách đề xuất.
  - Khi số phiếu `Accept > Reject`, nút màu đỏ **Payout** sẽ hiển thị.
  - Bấm nút **Payout** và xác nhận giao dịch trên MetaMask.

#### 5. Kiểm tra bạn A đã nhận được tiền chưa
- Kiểm tra tài khoản ví của bạn A trên MetaMask: Số dư tăng thêm `0.005 ETH`.
- Trạng thái nút Payout trên giao diện web chuyển thành màu xanh lá: **Paid**.
- Quỹ DAO Balance tự động trừ đi số tiền tương ứng.

