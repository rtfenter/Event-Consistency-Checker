# Event Consistency Checker  

[![Live Demo](https://img.shields.io/badge/Live%20Demo-000?style=for-the-badge)](https://rtfenter.github.io/Event-Consistency-Checker/)

### A tiny interactive tool to compare two JSON events and surface basic inconsistencies between their fields, naming, and types.

This project is part of my **Systems of Trust Series**, exploring how distributed systems maintain truth, alignment, and consistency across event flows and microservices.

The goal of this checker is to provide a simple, legible way to understand how small mismatches in event structure can create downstream confusion, drift, or data-quality issues.

---

## Purpose

Even when two events describe the same user action, small inconsistencies — different names, types, or missing fields — can create downstream ambiguity.  
These inconsistencies introduce:

- misaligned contract assumptions  
- data-quality issues  
- difficulties reconciling logs  
- incorrect dashboards and analytics  
- inconsistent interpretations of “what actually happened”  

This checker surfaces these mismatches clearly and early.

---

## Features (MVP)

The first version includes:

- Input boxes for Event A and Event B  
- Basic field comparison (presence/absence)  
- Naming differences (e.g., `user_id` vs `userId`)  
- Simple type checks (`"123"` vs `123`)  
- Summary of consistency level  
- Human-readable list of mismatches  

The tool is intentionally minimal and focused on conceptual clarity.

---

## Example

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

Output:
```
Inconsistencies Detected:
- Field name mismatch: user_id (Event A) vs userId (Event B)
- Type mismatch for user/user_id: number vs string
- Field only in Event A: action
- Field only in Event B: type

Consistency: Low
Issues: 4
```

---

## Demo Screenshot
<img width="2696" height="1532" alt="Screenshot 2025-11-23 at 09-05-35 Event Consistency Checker" src="https://github.com/user-attachments/assets/46999069-c382-4bfe-90e9-1aade7cc834a" />

---

## Consistency Check Flow Diagram

```
       [Event A JSON]       [Event B JSON]
              |                     |
              v                     v
        Extract Fields        Extract Fields
              \               /
               \             /
                v           v
           Field Presence Comparator
      (only in A, only in B, shared keys)
                |
                v
          Naming Comparator
   (user_id vs userId vs userid, etc.)
                |
                v
            Type Comparator
        ("123" vs 123, enum drift)
                |
                v
        Semantic/Meaning Drift Check
 (value interpretation differences, e.g. login vs LOGIN)
                |
                v
            Consistency Summary
      (pass/fail, mismatch count, notes)
```

---

## Why Event Consistency Matters

Even small inconsistencies can ripple through distributed systems:

- misaligned schemas between services  
- difficulty reconciling logs  
- incorrect analytics and dashboards  
- inconsistent business logic  
- harder debugging and incident review  
- model drift in ML systems  

This checker provides a small, understandable way to visualize how event drift and schema mismatches show up in practice.

---

## How This Maps to Real Systems

Even though it's simple, each part corresponds to real-world architecture:

### Field Naming  
Teams often evolve naming conventions independently (`user_id`, `userId`, `userid`).  
Standardization prevents integration failures.

### Type Consistency  
`"123"` vs `123` can break joins, dashboards, and ETL jobs.

### Missing Fields  
One service writing `action`, another writing `type` — this is a common cause of “silent divergence.”

### Consistency Summary  
In safety-critical or regulated environments, teams need a quick way to verify whether two events are describing the same conceptual action.

This tool represents a tiny, legible slice of that workflow.

---

## Part of the Systems of Trust Series

Main repo:  
https://github.com/rtfenter/Systems-of-Trust-Series

---

## Status

MVP implemented and active.  
This checker is intentionally lightweight and focuses on core mechanics, not production-grade validation.

---
## Local Use

No installation required.

To run locally:

1. Clone the repo  
2. Open `index.html` in your browser  

Everything runs client-side.
