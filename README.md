# 🎓 StudySpace — Collaborative Study Material & Personal Drive

> **The academic study platform designed for college students.**
> 
> *Solves messy WhatsApp study groups by combining shared community resources with a zero-duplicate personal workspace.*

---

## 🌟 The Problem & The Solution

### The Problem
During mid-semester and end-semester examinations, college students share hundreds or thousands of PDFs, lecture slides, PYQs, and video links across multiple WhatsApp groups (class section, coding clubs, placement preparation groups).
After thousands of messages, finding high-priority study material is nearly impossible because materials from every subject and class are mixed together, buried, or expired.

### The StudySpace Solution
StudySpace provides an intelligent, structured architecture:
1. **Students join communities/classes** (e.g. *CSE Section H*, *Coding Club*, *Placement Prep 2025*).
2. **Members share resources inside communities** organized by academic subjects (DSA, COA, Discrete Math, Probability & Statistics).
3. **Every resource has its own dedicated discussion** with questions and replies.
4. **Every student gets their own personal workspace** (visualized like a modern cloud drive).
5. **Students can add/reference resources from multiple communities into their personal workspace.**
6. **Zero File Duplication**: When a student adds a community resource to their workspace, **no duplicate file is created**. Only a lightweight personal reference is stored.
7. **Personal Customization**: A student can rename items in their workspace (e.g. `"🔥 MUST DO — Linked Lists"`), organize them into personal folders (e.g. `DSA`, `Important`), attach personal notes, and assign personal tags **without modifying or altering the original community resource for other students**.

---

## 🏛️ The Core Architectural Rule

```
                       ┌──────────────────────────────────────────────┐
                       │           Community Study Resource           │
                       │           (resourceId: "res-dsa-01")         │
                       │          title: "DSA Lecture 1.pdf"          │
                       │          community: "CSE Section H"          │
                       └──────────────────────┬───────────────────────┘
                                              │
                    ┌─────────────────────────┴────────────────────────┐
                    │                                                  │
                    ▼                                                  ▼
      ┌───────────────────────────┐                      ┌───────────────────────────┐
      │  Student A's Workspace    │                      │  Student B's Workspace    │
      │  (personalReferenceId)    │                      │  (personalReferenceId)    │
      │                           │                      │                           │
      │  personalName:            │                      │  personalName:            │
      │  "DSA Lecture 1.pdf"      │                      │  "🔥 MUST DO Week 1"      │
      │                           │                      │                           │
      │  personalFolderId:        │                      │  personalFolderId:        │
      │  "folder-dsa"             │                      │  "folder-important"       │
      │                           │                      │                           │
      │  personalNotes:           │                      │  personalNotes:           │
      │  "Review Big-O proofs"    │                      │  "Dr. Gupta quiz topics"  │
      │                           │                      │                           │
      │  starred: true            │                      │  starred: true            │
      │  completed: true          │                      │  completed: false         │
      └───────────────────────────┘                      └───────────────────────────┘
```

* **Renaming**: Renaming a personal reference modifies only `personalReference.personalName`. The community resource title remains `"DSA Lecture 1.pdf"`.
* **Moving**: Moving a personal reference into `My Workspace / Important` does not move the resource in the community.
* **Removing**: Removing a resource from My Workspace deletes only the student's personal reference. The community resource remains intact.
* **Multi-Community**: Resources from Community A and Community B can be filed together in the student's personal `DSA` folder.

---

## 🚀 Key Features

* **Multi-Community Aggregation**:
  * Combine materials from Section H, Coding Club, and Placement Preparation into a single personal subject folder.
  * Switch between *"Combine into my personal subjects"* and *"Keep communities separate"*.
  * Small community badges appear on every resource indicating where it originated.
* **In-App PDF & Resource Viewer**:
  * Realistic multi-page PDF viewer with zoom controls, dark reader mode, and full-screen support.
  * Embedded YouTube player for lecture links.
  * Instant access to document discussion threads and private personal notes.
* **Contextual Discussion System**:
  * Questions and answers are pinned directly to their specific study document.
  * Nested replies, timestamps, user avatars, and delete options.
  * Community-wide Discussions feed with 1-click jump to the resource.
* **Global Instant Search (`⌘K` / `Ctrl+K`)**:
  * Debounced search across titles, subjects, communities, uploaders, personal tags, and discussions.
  * Direct indicator showing whether a file is already in your workspace.
* **1-Click Demo Personas**:
  * **Arjun Sharma** (Student, CSE 3rd Year)
  * **Priya Patel** (Class Representative & Admin of Section H)
  * **Rohit Verma** (Coding Club Lead)
  * **Dr. Ramesh Gupta** (Course Professor)

---

## 🧪 Try The 17-Step Core Demo Flow

1. Open the application.
2. Sign in or click the demo user profile.
3. Open **Communities** and select **CSE Section H**.
4. Open the **Resources** tab and select subject **Data Structures & Algorithms**.
5. Click on **"DSA Lecture 1.pdf"** to open the in-app PDF viewer.
6. Read the lecture slides and view the questions asked by classmates in the right-hand discussion tab.
7. Click **"Add to My Workspace"**.
8. Navigate to **My Workspace** in the sidebar.
9. Open folder **📁 DSA** — the resource appears organized inside!
10. Click the three dots `...` on **"DSA Unit 3 Linked Lists.pdf"** and select **"Personalize Display Name"**.
11. Change the name to: `🔥 MUST DO — Linked Lists`.
12. Go back to **Communities → Coding Club** — the original title still reads `DSA Unit 3 Linked Lists.pdf`!
13. In My Workspace, click **"Move to Personal Folder"** and select **Important**.
14. The community structure remains completely untouched.
15. Open **Communities → Placement Preparation 2025** and add **"DSA FAANG Roadmap 2025.pdf"**.
16. Open your personal **DSA** folder — resources from CSE Section H, Coding Club, and Placement Preparation now live together in your private folder!
17. Click the **Studied** checkmark to mark resources completed as you prepare for exams.

---

## 🛠️ Tech Stack

* **Framework**: React 19 + TypeScript + Vite 8
* **Styling**: Tailwind CSS v4 (native `@tailwindcss/vite`)
* **Routing**: React Router DOM v7
* **Icons**: Lucide React
* **Persistence**: Reactive Context API with LocalStorage sync
* **Testing**: Node.js Test Runner + tsx

---

## 💻 Local Development & Build

```bash
# 1. Install dependencies
npm install

# 2. Run automated architecture & integrity tests
npm test

# 3. Start local development server
npm run dev

# 4. Create optimized production build
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 📋 Verified Test Suite

```
▶ StudySpace Core Architecture & Integrity Tests
  ✔ Rule 1: Resources exist independently in communities with unique IDs
  ✔ Rule 2: Adding to workspace creates a PersonalReference pointing to the unchanged resource without duplicate files
  ✔ Rule 3: Personal renaming modifies ONLY the personal display name, community resource title is untouched
  ✔ Rule 4: Moving personal reference between folders does NOT move community resource
  ✔ Rule 5: Removing a personal reference leaves community resource intact
  ✔ Rule 6: Multi-Community Aggregation: user can combine resources from multiple communities into ONE personal folder
  ✔ Rule 7: Discussions attach to resource and support nested replies
  ✔ Rule 8: Communities have codes, members, and subjects
✔ StudySpace Core Architecture & Integrity Tests (8 passed, 0 failed)
```
