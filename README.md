# RIA Prototype — Simple Event-Consistency Checker
A tiny, public-safe prototype that compares two JSON events for simple schema or field inconsistencies.

This demo is intentionally minimal. It does **not** represent the internal Recursive Identity Architecture (RIA) or any private mechanisms. It only shows the *shape* of a small applied prototype: checking whether two events describe “the same thing” in compatible ways.

---

## 🔍 What This Prototype Does
- Takes two JSON events (Event A and Event B)
- Compares them for simple inconsistencies, such as:
  - different field names for the same concept (`user_id` vs `userId`)
  - type mismatches (`"123"` vs `123`)
  - missing fields that exist in the other event
- Produces a tiny consistency summary

This is a conceptual illustration of event/schema consistency — nothing more.

---

## 🧪 Example Input

Event A:
```json
{
  "user_id": 123,
  "action": "login",
  "timestamp": "2025-11-22T15:00:00Z"
}
```

Event B:
```json
{
  "userId": "123",
  "type": "LOGIN",
  "timestamp": "2025-11-22T15:00:00Z"
}
```

---

## 📤 Example Output

```text
Inconsistencies Detected:
- Field name mismatch: user_id (Event A) vs userId (Event B)
- Possible type mismatch for user/user_id (number vs string)
- Field present only in Event A: action
- Field present only in Event B: type

Consistency: Low
Issues: 4
```

---

## 📁 Files in This Repo
- `index.html` — simple browser-based prototype runnable via GitHub Pages

The prototype runs entirely in the browser and does not require any build step.

---

## 🔒 Safety Note
This prototype does **not** include:
- the internal RIA architecture  
- private loops  
- detection thresholds  
- production data models  
- any underlying system mechanisms  

It is purely a lightweight demonstration for GitHub.

---

## 🧭 Related Work
- **RIA Research Notes (master repo):** https://github.com/rtfenter/RIA-Research-Notes  
- **RIA Prototype — Drift Detector:** https://github.com/rtfenter/RIA-Drift-Detector  
- **Loyalty Systems Series:** https://github.com/rtfenter/Loyalty-Systems-Series
