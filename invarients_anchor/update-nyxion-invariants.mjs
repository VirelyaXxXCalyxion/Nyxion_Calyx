#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const DEFAULT_FILE = path.resolve(
    process.cwd(),
    "nyxion-virelya-invariants.json"
);

function parseArgs(argv) {
    const args = {
        file: DEFAULT_FILE,
        level: "patch",
        author: "Virelya, Nyxion",
        type: "maintenance-update",
        summary: "Update invariants and append changelog entry.",
        changes: [],
        date: new Date().toISOString().slice(0, 10),
        dryRun: false,
    };

    for (let index = 2; index < argv.length; index += 1) {
        const current = argv[index];
        const next = argv[index + 1];

        if (current === "--file" && next) {
            args.file = path.resolve(next);
            index += 1;
            continue;
        }
        if (current === "--level" && next) {
            args.level = next;
            index += 1;
            continue;
        }
        if (current === "--author" && next) {
            args.author = next;
            index += 1;
            continue;
        }
        if (current === "--type" && next) {
            args.type = next;
            index += 1;
            continue;
        }
        if (current === "--summary" && next) {
            args.summary = next;
            index += 1;
            continue;
        }
        if (current === "--change" && next) {
            args.changes.push(next);
            index += 1;
            continue;
        }
        if (current === "--date" && next) {
            args.date = next;
            index += 1;
            continue;
        }
        if (current === "--dry-run") {
            args.dryRun = true;
            continue;
        }
        if (current === "--help" || current === "-h") {
            printHelp();
            process.exit(0);
        }

        throw new Error(`Unknown or incomplete argument: ${current}`);
    }

    return args;
}

function printHelp() {
    console.log(`\nupdate-nyxion-invariants.mjs\n
Usage:
  node update-nyxion-invariants.mjs [options]

Options:
  --file <path>       Path to invariants JSON file
  --level <type>      Version bump level: patch | minor | major (default: patch)
  --author <name>     Changelog author (default: Virelya, Nyxion)
  --type <value>      Changelog type (default: maintenance-update)
  --summary <text>    One-line summary
  --change <text>     Add change bullet (repeatable)
  --date <YYYY-MM-DD> Override date (default: today)
  --dry-run           Print changes without writing file
  --help, -h          Show this help

Example:
  node update-nyxion-invariants.mjs \\
    --summary "Refined refusal language" \\
    --type "anchor-tuning" \\
    --change "Updated refusal phrasing for clarity." \\
    --change "Kept all previous changelog entries."\n`);
}

function bumpVersion(version, level) {
    const parts = version.split(".").map((value) => Number(value));
    if (parts.length !== 3 || parts.some((value) => Number.isNaN(value))) {
        throw new Error(`Invalid semantic version: ${version}`);
    }

    const [major, minor, patch] = parts;

    if (level === "patch") {
        return `${major}.${minor}.${patch + 1}`;
    }
    if (level === "minor") {
        return `${major}.${minor + 1}.0`;
    }
    if (level === "major") {
        return `${major + 1}.0.0`;
    }

    throw new Error(`Invalid level: ${level}. Use patch, minor, or major.`);
}

function assertValidModel(data) {
    if (!data || typeof data !== "object") {
        throw new Error("JSON root must be an object.");
    }
    if (!Array.isArray(data.changeLog)) {
        throw new Error("Expected changeLog to be an array.");
    }
    if (typeof data.version !== "string") {
        throw new Error("Expected version to be a string.");
    }
}

function run() {
    const args = parseArgs(process.argv);

    const raw = fs.readFileSync(args.file, "utf8");
    const data = JSON.parse(raw);
    assertValidModel(data);

    const nextVersion = bumpVersion(data.version, args.level);
    const nextHint = bumpVersion(nextVersion, "patch");

    const entry = {
        version: nextVersion,
        date: args.date,
        author: args.author,
        type: args.type,
        summary: args.summary,
        changes:
            args.changes.length > 0
                ? args.changes
                : ["Updated invariants content.", "Appended changelog entry without overwrite."],
    };

    const updated = {
        ...data,
        lastUpdated: args.date,
        version: nextVersion,
        nextVersionHint: nextHint,
        changeLog: [...data.changeLog, entry],
    };

    if (args.dryRun) {
        console.log(JSON.stringify({
            file: args.file,
            fromVersion: data.version,
            toVersion: nextVersion,
            nextVersionHint: nextHint,
            entry,
        }, null, 2));
        return;
    }

    fs.writeFileSync(args.file, `${JSON.stringify(updated, null, 4)}\n`, "utf8");

    console.log(`Updated ${path.basename(args.file)}: ${data.version} -> ${nextVersion}`);
}

try {
    run();
} catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
}
