# MongoDB Atlas setup guide

Atlas = MongoDB-r free cloud database. Ekbar setup korle tor laptop-e kichu install korte hobe na.

> Atlas-er UI majhe majhe bodlay. Button-er naam ektu alada hole kachakachi option-ta khujbi, step same.

---

## Step 1: Account + Project

1. https://cloud.mongodb.com e jaa, Google diye sign in kor.
2. Upore-bame **Project** dropdown → **New Project** → naam de `taskflow` → **Create Project**.
   (Already project thakle oitai use korte paris.)

## Step 2: Free cluster banao

1. **Create** / **Build a Database** button-e click kor.
2. **M0 (Free)** select kor. Eta free.
3. Provider: AWS. Region: tor kachakachi kono region (jemon **Mumbai (ap-south-1)** ba **Singapore**). Kache hole fast.
4. Cluster name: `Cluster0` thakuk → **Create Deployment**.
5. 1-3 minute wait kor.

## Step 3: Database user banao

Ei user-er naam ar password connection string-e boshbe. Eta tor Atlas login na, alada.

1. Popup ashle shekhane, na hole bam menu-te **Security → Database Access** → **Add New Database User**.
2. Authentication: **Password**.
3. Username: `taskflow_user`
4. Password: **Autogenerate** click kor, **copy kore kothao save kor**.
   - Nije password dile `@ : / ? # %` egula dish na. Egula connection string bhenge dey.
5. Role: **Read and write to any database** → **Add User**.

## Step 4: Network access (IP allow)

Atlas by default shob IP block kore rakhe.

1. Bam menu → **Security → Network Access** → **Add IP Address**.
2. **Add Current IP Address** → **Confirm**.
   - Tor ISP IP change korte thake. Tokhon connection timeout dile ekhane abar ashbi.
   - Shudhu practice-er jonno shortcut: **Allow Access from Anywhere** (`0.0.0.0/0`). Real project-e eta korbi na.

## Step 5: Connection string copy kor

1. Bam menu → **Database / Clusters** → Cluster0-er pashe **Connect**.
2. **Drivers** select kor → Driver: **Node.js**.
3. Ekta string dekhabe, emon:

   ```
   mongodb+srv://taskflow_user:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

4. Copy kor. `<db_password>`-er jaygay Step 3-er password boshabi (`< >` soho muche).
   (`npm install mongodb` dekhale skip kor, already installed.)

## Step 6: `.env` file banao

`backend/` folder-e `.env.example` copy kore `.env` naam de, tarpor fill kor:

```env
PORT=5000
MONGODB_URI=mongodb+srv://taskflow_user:TOR_PASSWORD@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=taskflow
```

- `.env` **kokhono git-e commit korbi na**. `.gitignore`-e already add kora ache.
- Database `taskflow` ar collection `tasks` nijer theke toiri hobe, prothom task insert korle.

## Step 7: Run kor

```bash
cd backend
npm run dev
```

Terminal-e ei line dekhle connect hoye geche:

```
✅ MongoDB connected (database: taskflow)
```

## Step 8: Data dekh

Frontend theke ekta task add kor. Tarpor Atlas → Cluster0 → **Browse Collections** / **Data Explorer** → `taskflow` → `tasks`. Tor document dekhte pabi.

---

## Error hole

| Error | Karon | Fix |
| --- | --- | --- |
| `bad auth : authentication failed` | username/password bhul | Step 3-e password reset kor, `.env` update kor. `< >` muchecho kina check kor |
| `MongoServerSelectionError` / timeout | tor IP allow kora nai | Step 4 abar kor (IP change hoye thakte pare) |
| `querySrv ENOTFOUND` / `ECONNREFUSED` (`_mongodb._tcp...`) | ISP-er DNS `+srv` resolve korte parche na | PC-r DNS `8.8.8.8` / `1.1.1.1` kor, **othoba** Atlas Connect page theke non-SRV (`mongodb://...`, onek host soho) string nao |
| `MONGODB_URI is missing in backend/.env` | `.env` nai ba bhul folder-e | `.env` must be `backend/` folder-e, `index.js`-er pashe |
| Password-e special character | `@` ba `:` URL bhenge dey | Password bodlao, othoba `encodeURIComponent("pass")` diye encode kore boshao |
