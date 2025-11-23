// Event Consistency Checker — upgraded layout version

function safeParse(jsonText) {
  try {
    return { ok: true, value: JSON.parse(jsonText) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// Core comparison logic (close to original)
function compareEvents(eventA, eventB) {
  const issues = [];
  const keysA = Object.keys(eventA);
  const keysB = Object.keys(eventB);

  const onlyA = new Set(keysA);
  const onlyB = new Set(keysB);

  // Special-case: user_id vs userId naming difference
  if (
    Object.prototype.hasOwnProperty.call(eventA, "user_id") &&
    Object.prototype.hasOwnProperty.call(eventB, "userId")
  ) {
    issues.push("Field name mismatch: user_id (Event A) vs userId (Event B)");
    onlyA.delete("user_id");
    onlyB.delete("userId");

    // Type check for this conceptual "user" field
    const typeA = typeof eventA["user_id"];
    const typeB = typeof eventB["userId"];
    if (typeA !== typeB) {
      issues.push("Type mismatch for user/user_id: " + typeA + " vs " + typeB);
    }
  }

  // Keys present in both with same spelling
  keysA.forEach(function (key) {
    if (keysB.includes(key)) {
      onlyA.delete(key);
      onlyB.delete(key);

      const typeA = typeof eventA[key];
      const typeB = typeof eventB[key];
      if (typeA !== typeB) {
        issues.push('Type mismatch for "' + key + '": ' + typeA + " vs " + typeB);
      }
    }
  });

  // Fields only in Event A
  onlyA.forEach(function (key) {
    issues.push("Field only in Event A: " + key);
  });

  // Fields only in Event B
  onlyB.forEach(function (key) {
    issues.push("Field only in Event B: " + key);
  });

  let consistency = "High";
  if (issues.length >= 1 && issues.length <= 2) {
    consistency = "Medium";
  } else if (issues.length > 2) {
    consistency = "Low";
  }

  return {
    issues,
    consistency
  };
}

function formatResult(result) {
  const lines = [];

  if (result.issues.length === 0) {
    lines.push("No inconsistencies detected.");
  } else {
    lines.push("Inconsistencies Detected:");
    result.issues.forEach(function (issue) {
      lines.push("- " + issue);
    });
  }

  lines.push("");
  lines.push("Consistency: " + result.consistency);
  lines.push("Issues: " + result.issues.length);

  return lines.join("\n");
}

// DOM references
const eventAInput = document.getElementById("event-a-input");
const eventBInput = document.getElementById("event-b-input");
const checkBtn = document.getElementById("check-btn");
const statusEl = document.getElementById("check-status");
const summaryEl = document.getElementById("summary");
const namingLine = document.getElementById("naming-line");
const typesLine = document.getElementById("types-line");
const overallLine = document.getElementById("overall-line");
const rawOutput = document.getElementById("raw-output");
const loadExampleBtn = document.getElementById("load-example");

function resetSummary() {
  summaryEl.innerHTML = `
    <div class="summary-badge summary-badge-idle">
      No comparison run yet.
    </div>
  `;
  namingLine.textContent =
    "Field naming differences and fields present in only one event will appear here.";
  typesLine.textContent =
    "Type mismatches (e.g., number vs string) will be listed here.";
  overallLine.textContent =
    "The checker will summarize how closely these two events align.";
  rawOutput.textContent =
    'Click "Check Consistency" to see issues and a simple consistency summary.';
}

// Update summary based on result
function renderSummary(result) {
  summaryEl.innerHTML = "";

  const badge = document.createElement("div");

  if (!result || !result.issues) {
    badge.className = "summary-badge summary-badge-idle";
    badge.textContent = "No comparison run yet.";
    summaryEl.appendChild(badge);
    return;
  }

  if (result.issues.length === 0) {
    badge.className = "summary-badge summary-badge-ok";
    badge.textContent = "Events are highly consistent. No issues detected.";
  } else {
    badge.className = "summary-badge summary-badge-fail";
    badge.innerHTML = `
      Consistency: <span class="count">${result.consistency}</span>
      · Issues: <span class="count">${result.issues.length}</span>
    `;
  }

  summaryEl.appendChild(badge);
}

// Fill card-level details
function renderDetails(result) {
  if (!result || !result.issues) {
    resetSummary();
    return;
  }

  const issues = result.issues;

  const namingIssues = issues.filter((msg) =>
    msg.startsWith("Field name mismatch")
  );
  const onlyFieldIssues = issues.filter((msg) =>
    msg.startsWith("Field only in Event")
  );
  const typeIssues = issues.filter((msg) =>
    msg.startsWith("Type mismatch")
  );

  // Naming & Field coverage
  if (namingIssues.length === 0 && onlyFieldIssues.length === 0) {
    namingLine.textContent = "No naming or field-presence mismatches detected.";
  } else {
    const parts = [];
    if (namingIssues.length > 0) {
      parts.push(
        "Naming differences: <strong>" +
          namingIssues.length +
          "</strong> issue" +
          (namingIssues.length === 1 ? "" : "s")
      );
    }
    if (onlyFieldIssues.length > 0) {
      parts.push(
        "Fields only in one event: <strong>" +
          onlyFieldIssues.length +
          "</strong> issue" +
          (onlyFieldIssues.length === 1 ? "" : "s")
      );
    }
    namingLine.innerHTML = parts.join("<br />");
  }

  // Type alignment
  if (typeIssues.length === 0) {
    typesLine.textContent = "No type mismatches detected.";
  } else {
    typesLine.innerHTML =
      "Type mismatches:<br /><strong>" +
      typeIssues.join("<br />") +
      "</strong>";
  }

  // Overall consistency
  if (issues.length === 0) {
    overallLine.innerHTML =
      "Overall consistency: <strong>High</strong>. Events appear to describe the same concept.";
  } else {
    const level = result.consistency;
    let explanation = "";
    if (level === "High") {
      explanation =
        "Minor differences detected, but events are still mostly aligned.";
    } else if (level === "Medium") {
      explanation =
        "Several differences detected; integration or analytics may behave differently.";
    } else {
      explanation =
        "Substantial differences detected; these events likely do not represent a stable shared contract.";
    }
    overallLine.innerHTML =
      "Overall consistency: <strong>" + level + "</strong>.<br />" + explanation;
  }

  // Raw report
  rawOutput.textContent = formatResult(result);
}

// Hook up main button
checkBtn.addEventListener("click", function () {
  const textA = eventAInput.value || "";
  const textB = eventBInput.value || "";

  const parsedA = safeParse(textA);
  const parsedB = safeParse(textB);

  if (!parsedA.ok || !parsedB.ok) {
    let msg = "Error parsing JSON:\n";
    if (!parsedA.ok) {
      msg += "- Event A: " + parsedA.error + "\n";
    }
    if (!parsedB.ok) {
      msg += "- Event B: " + parsedB.error + "\n";
    }
    rawOutput.textContent = msg.trim();
    summaryEl.innerHTML = `
      <div class="summary-badge summary-badge-fail">
        Cannot compare — invalid JSON in one or both events.
      </div>
    `;
    namingLine.textContent =
      "Fix JSON parsing errors before checking naming or field coverage.";
    typesLine.textContent = "Fix JSON parsing errors before checking types.";
    overallLine.textContent =
      "Awaiting valid events to compute consistency.";
    statusEl.textContent = "JSON parsing error.";
    return;
  }

  const result = compareEvents(parsedA.value, parsedB.value);
  statusEl.textContent = "Comparison complete.";
  renderSummary(result);
  renderDetails(result);
});

// Example loader (original pair)
function loadExamplePair() {
  eventAInput.value = `{
  "user_id": 123,
  "action": "login",
  "timestamp": "2025-11-22T15:00:00Z"
}`;
  eventBInput.value = `{
  "userId": "123",
  "type": "LOGIN",
  "timestamp": "2025-11-22T15:00:00Z"
}`;
  statusEl.textContent =
    'Example events loaded. Click "Check Consistency" to see issues.';
  resetSummary();
}

if (loadExampleBtn) {
  loadExampleBtn.addEventListener("click", loadExamplePair);
}

// Initial state
resetSummary();
