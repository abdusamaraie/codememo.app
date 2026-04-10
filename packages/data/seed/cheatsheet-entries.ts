/**
 * Cheat sheet entry seed data for all languages.
 *
 * Quick-reference entries organized by category, accessible from the
 * study mode slide-over panel.
 *
 * Sources:
 *   JCR-SQL2 — https://academy.jahia.com/documentation/jahia-cms/jahia-8.2/developer/leveraging-jahia-backend-capabilities/jcrsql2-query-cheat-sheet
 *   Python   — https://docs.python.org/3/
 *   JavaScript — https://developer.mozilla.org/en-US/docs/Web/JavaScript
 */

export interface CheatSheetEntrySeed {
  languageSlug: string;
  category: string;
  title: string;
  syntax: string;
  description: string;
  example?: string;
  order: number;
  isPublished: boolean;
}

// ─── JCR-SQL2 Cheat Sheet ────────────────────────────────────────────────────

const jcrNodeTypes: CheatSheetEntrySeed[] = [
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[nt:base]', syntax: 'SELECT * FROM [nt:base]', description: 'Base type — matches ALL nodes. Use sparingly for performance.', order: 1, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[nt:unstructured]', syntax: 'SELECT * FROM [nt:unstructured]', description: 'Generic content nodes, typically components.', order: 2, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[nt:file]', syntax: 'SELECT * FROM [nt:file]', description: 'File nodes in DAM.', order: 3, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[nt:folder]', syntax: 'SELECT * FROM [nt:folder]', description: 'Folder nodes.', order: 4, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[nt:resource]', syntax: 'SELECT * FROM [nt:resource]', description: 'Binary content holder.', order: 5, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[cq:Page]', syntax: 'SELECT * FROM [cq:Page]', description: 'AEM page nodes.', order: 6, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[cq:PageContent]', syntax: 'SELECT * FROM [cq:PageContent]', description: 'Page jcr:content nodes (cq:lastModified, cq:template).', order: 7, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[cq:Component]', syntax: 'SELECT * FROM [cq:Component]', description: 'Component definition nodes.', order: 8, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[cq:Template]', syntax: 'SELECT * FROM [cq:Template]', description: 'Template definition nodes.', order: 9, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[cq:ClientLibraryFolder]', syntax: 'SELECT * FROM [cq:ClientLibraryFolder]', description: 'Client library folders.', order: 10, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[dam:Asset]', syntax: 'SELECT * FROM [dam:Asset]', description: 'DAM asset nodes (images, PDFs, etc.).', order: 11, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[dam:AssetContent]', syntax: 'SELECT * FROM [dam:AssetContent]', description: 'Asset metadata container.', order: 12, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[sling:Folder]', syntax: 'SELECT * FROM [sling:Folder]', description: 'Sling folder type.', order: 13, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[sling:OrderedFolder]', syntax: 'SELECT * FROM [sling:OrderedFolder]', description: 'Ordered folder type.', order: 14, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[rep:User]', syntax: 'SELECT * FROM [rep:User]', description: 'User nodes (in /home/users).', order: 15, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Node Types', title: '[rep:Group]', syntax: 'SELECT * FROM [rep:Group]', description: 'Group nodes (in /home/groups).', order: 16, isPublished: true },
];

const jcrPathFunctions: CheatSheetEntrySeed[] = [
  { languageSlug: 'jcr-sql2', category: 'Path Functions', title: 'ISDESCENDANTNODE', syntax: "ISDESCENDANTNODE(selector, '/path')", description: 'Any depth beneath path (most common).', example: "WHERE ISDESCENDANTNODE(s, '/content/mysite')", order: 1, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Path Functions', title: 'ISCHILDNODE', syntax: "ISCHILDNODE(selector, '/path')", description: 'Direct children only (one level).', example: "WHERE ISCHILDNODE(s, '/content/dam')", order: 2, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Path Functions', title: 'ISSAMENODE', syntax: "ISSAMENODE(selector, '/path')", description: 'Exact node path match.', example: "WHERE ISSAMENODE(s, '/content/mysite/en')", order: 3, isPublished: true },
];

const jcrTextSearch: CheatSheetEntrySeed[] = [
  { languageSlug: 'jcr-sql2', category: 'Text Search', title: "CONTAINS(*, 'term')", syntax: "CONTAINS(*, 'term')", description: 'Full-text search all indexed properties.', example: "WHERE CONTAINS(*, 'welcome')", order: 1, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Text Search', title: "CONTAINS([prop], 'term')", syntax: "CONTAINS([prop], 'term')", description: 'Full-text search specific property.', example: "WHERE CONTAINS([jcr:title], 'home')", order: 2, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Text Search', title: 'LIKE', syntax: "property LIKE 'pattern'", description: 'Pattern matching (% = any chars, _ = single char).', example: "WHERE [jcr:title] LIKE 'Home%'", order: 3, isPublished: true },
];

const jcrNameFunctions: CheatSheetEntrySeed[] = [
  { languageSlug: 'jcr-sql2', category: 'Name Functions', title: 'NAME()', syntax: 'NAME()', description: 'Returns node name (with namespace prefix).', example: "WHERE NAME() = 'jcr:content'", order: 1, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Name Functions', title: 'NAME(selector)', syntax: 'NAME(selector)', description: 'Node name of specific selector.', example: "WHERE NAME(s) LIKE '%.png'", order: 2, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Name Functions', title: 'LOCALNAME()', syntax: 'LOCALNAME()', description: 'Node name without namespace prefix.', example: "WHERE LOCALNAME() = 'content'", order: 3, isPublished: true },
];

const jcrComparisonOps: CheatSheetEntrySeed[] = [
  { languageSlug: 'jcr-sql2', category: 'Comparison Operators', title: '=', syntax: "[prop] = 'value'", description: 'Equals.', order: 1, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Comparison Operators', title: '<>', syntax: "[prop] <> 'value'", description: 'Not equals.', order: 2, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Comparison Operators', title: '<', syntax: '[count] < 10', description: 'Less than.', order: 3, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Comparison Operators', title: '>', syntax: '[count] > 5', description: 'Greater than.', order: 4, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Comparison Operators', title: '<=', syntax: '[count] <= 10', description: 'Less than or equal.', order: 5, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Comparison Operators', title: '>=', syntax: '[count] >= 5', description: 'Greater than or equal.', order: 6, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Comparison Operators', title: 'IS NULL', syntax: '[prop] IS NULL', description: 'Property does not exist.', order: 7, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Comparison Operators', title: 'IS NOT NULL', syntax: '[prop] IS NOT NULL', description: 'Property exists.', order: 8, isPublished: true },
];

const jcrLogicalOps: CheatSheetEntrySeed[] = [
  { languageSlug: 'jcr-sql2', category: 'Logical Operators', title: 'AND', syntax: "[a] = 1 AND [b] = 2", description: 'Both conditions must be true.', order: 1, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Logical Operators', title: 'OR', syntax: "[a] = 1 OR [b] = 2", description: 'Either condition can be true.', order: 2, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Logical Operators', title: 'NOT', syntax: "NOT [prop] = 'value'", description: 'Negates a condition.', order: 3, isPublished: true },
];

const jcrOrdering: CheatSheetEntrySeed[] = [
  { languageSlug: 'jcr-sql2', category: 'Ordering', title: 'ORDER BY ASC', syntax: 'ORDER BY [prop] ASC', description: 'Sort ascending (default).', example: 'ORDER BY [jcr:created] ASC', order: 1, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Ordering', title: 'ORDER BY DESC', syntax: 'ORDER BY [prop] DESC', description: 'Sort descending.', example: 'ORDER BY [jcr:created] DESC', order: 2, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Ordering', title: '[jcr:score]', syntax: 'ORDER BY [jcr:score] DESC', description: 'Relevance score (for CONTAINS queries).', order: 3, isPublished: true },
];

const jcrPseudoColumns: CheatSheetEntrySeed[] = [
  { languageSlug: 'jcr-sql2', category: 'Pseudo Columns', title: '[jcr:path]', syntax: 'SELECT [jcr:path] FROM ...', description: 'Full path of the node.', order: 1, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Pseudo Columns', title: '[jcr:score]', syntax: 'SELECT [jcr:score] FROM ...', description: 'Relevance score for full-text queries.', order: 2, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Pseudo Columns', title: '[jcr:primaryType]', syntax: 'SELECT [jcr:primaryType] FROM ...', description: "Node's primary type.", order: 3, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Pseudo Columns', title: '[jcr:mixinTypes]', syntax: 'SELECT [jcr:mixinTypes] FROM ...', description: "Node's mixin types.", order: 4, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Pseudo Columns', title: '[jcr:uuid]', syntax: 'SELECT [jcr:uuid] FROM ...', description: "Node's unique identifier (if referenceable).", order: 5, isPublished: true },
];

const jcrCommonProperties: CheatSheetEntrySeed[] = [
  { languageSlug: 'jcr-sql2', category: 'Common Properties', title: '[jcr:title]', syntax: "[jcr:title] = 'value'", description: 'Node title.', order: 1, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Common Properties', title: '[jcr:description]', syntax: "[jcr:description] LIKE '%term%'", description: 'Node description.', order: 2, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Common Properties', title: '[jcr:created]', syntax: 'ORDER BY [jcr:created] DESC', description: 'Creation timestamp.', order: 3, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Common Properties', title: '[jcr:createdBy]', syntax: "[jcr:createdBy] = 'admin'", description: 'Creator user ID.', order: 4, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Common Properties', title: '[jcr:lastModified]', syntax: 'ORDER BY [jcr:lastModified] DESC', description: 'Last modification timestamp.', order: 5, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Common Properties', title: '[cq:lastModified]', syntax: "[cq:lastModified] >= CAST('2024-01-01' AS DATE)", description: 'AEM last modification timestamp.', order: 6, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Common Properties', title: '[cq:template]', syntax: "[cq:template] = '/conf/mysite/templates/page'", description: 'Page template path.', order: 7, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Common Properties', title: '[sling:resourceType]', syntax: "[sling:resourceType] = 'myapp/components/text'", description: 'Component resource type.', order: 8, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Common Properties', title: '[sling:resourceSuperType]', syntax: "[sling:resourceSuperType] = 'core/components/text'", description: 'Parent resource type.', order: 9, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Common Properties', title: '[dc:format]', syntax: "[dc:format] = 'image/png'", description: 'MIME type for assets.', order: 10, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Common Properties', title: '[dc:title]', syntax: "[dc:title] LIKE '%logo%'", description: 'Dublin Core title for assets.', order: 11, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'Common Properties', title: '[cq:lastReplicationAction]', syntax: "[cq:lastReplicationAction] = 'Activate'", description: 'Activate/Deactivate/Delete status.', order: 12, isPublished: true },
];

const jcrCastTypes: CheatSheetEntrySeed[] = [
  { languageSlug: 'jcr-sql2', category: 'CAST Types', title: 'CAST AS STRING', syntax: "CAST(value AS STRING)", description: 'Cast to string type.', order: 1, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'CAST Types', title: 'CAST AS DATE', syntax: "CAST('2024-01-01T00:00:00.000Z' AS DATE)", description: 'Cast to date type.', order: 2, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'CAST Types', title: 'CAST AS LONG', syntax: 'CAST(value AS LONG)', description: 'Cast to long/number type.', order: 3, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'CAST Types', title: 'CAST AS DOUBLE', syntax: 'CAST(value AS DOUBLE)', description: 'Cast to decimal type.', order: 4, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'CAST Types', title: 'CAST AS BOOLEAN', syntax: 'CAST(value AS BOOLEAN)', description: 'Cast to boolean type.', order: 5, isPublished: true },
];

const jcrJoinKeywords: CheatSheetEntrySeed[] = [
  { languageSlug: 'jcr-sql2', category: 'JOIN Keywords', title: 'INNER JOIN', syntax: 'INNER JOIN [type] AS b ON ISCHILDNODE(b, a)', description: 'Only matching rows from both sides.', order: 1, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'JOIN Keywords', title: 'LEFT OUTER JOIN', syntax: 'LEFT OUTER JOIN [type] AS b ON ISCHILDNODE(b, a)', description: 'All from left, matching from right.', order: 2, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'JOIN Keywords', title: 'RIGHT OUTER JOIN', syntax: 'RIGHT OUTER JOIN [type] AS b ON ISCHILDNODE(b, a)', description: 'All from right, matching from left.', order: 3, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'JOIN Keywords', title: 'ON ISCHILDNODE(a, b)', syntax: 'ON ISCHILDNODE(a, b)', description: 'Join condition: a is child of b.', order: 4, isPublished: true },
  { languageSlug: 'jcr-sql2', category: 'JOIN Keywords', title: 'ON ISDESCENDANTNODE(a, b)', syntax: 'ON ISDESCENDANTNODE(a, b)', description: 'Join condition: a is descendant of b.', order: 5, isPublished: true },
];

const jcrCheatSheetEntries: CheatSheetEntrySeed[] = [
  ...jcrNodeTypes,
  ...jcrPathFunctions,
  ...jcrTextSearch,
  ...jcrNameFunctions,
  ...jcrComparisonOps,
  ...jcrLogicalOps,
  ...jcrOrdering,
  ...jcrPseudoColumns,
  ...jcrCommonProperties,
  ...jcrCastTypes,
  ...jcrJoinKeywords,
];

// ─── Python Cheat Sheet ──────────────────────────────────────────────────────

const pythonCheatSheetEntries: CheatSheetEntrySeed[] = [
  // Variables & Types
  { languageSlug: 'python', category: 'Variables & Types', title: 'Type checking', syntax: 'type(x)  # <class \'int\'>\nisinstance(x, int)  # True', description: 'Check variable type at runtime.', order: 1, isPublished: true },
  { languageSlug: 'python', category: 'Variables & Types', title: 'Multiple assignment', syntax: 'a, b, c = 1, 2, 3\na = b = c = 0', description: 'Assign multiple variables in one line.', order: 2, isPublished: true },
  { languageSlug: 'python', category: 'Variables & Types', title: 'Type conversion', syntax: 'int("42")  str(42)  float("3.14")\nlist("abc")  # [\'a\', \'b\', \'c\']', description: 'Convert between built-in types.', order: 3, isPublished: true },

  // Strings
  { languageSlug: 'python', category: 'Strings', title: 'f-string', syntax: 'f"Hello {name}, you are {age} years old"', description: 'Formatted string literal (Python 3.6+).', example: 'f"{value:.2f}"  # 2 decimal places\nf"{name!r}"     # repr() output', order: 1, isPublished: true },
  { languageSlug: 'python', category: 'Strings', title: 'String methods', syntax: 's.strip()  s.split(",")  s.join(lst)\ns.replace("old", "new")  s.startswith("pre")', description: 'Common string manipulation methods.', order: 2, isPublished: true },
  { languageSlug: 'python', category: 'Strings', title: 'Slicing', syntax: 's[start:stop:step]\ns[::-1]  # reverse', description: 'Extract substrings with slice notation.', order: 3, isPublished: true },

  // Collections
  { languageSlug: 'python', category: 'Collections', title: 'List comprehension', syntax: '[expr for item in iterable if condition]', description: 'Create lists with a concise expression.', example: 'squares = [x**2 for x in range(10)]\nevens = [x for x in nums if x % 2 == 0]', order: 1, isPublished: true },
  { languageSlug: 'python', category: 'Collections', title: 'Dict comprehension', syntax: '{key: value for item in iterable}', description: 'Create dicts with a concise expression.', example: '{k: v for k, v in pairs if v > 0}', order: 2, isPublished: true },
  { languageSlug: 'python', category: 'Collections', title: 'Unpacking', syntax: 'first, *rest = [1, 2, 3, 4]\na, b = b, a  # swap', description: 'Unpack iterables into variables.', order: 3, isPublished: true },
  { languageSlug: 'python', category: 'Collections', title: 'Dict operations', syntax: 'd.get(key, default)  d.setdefault(k, v)\nd.items()  d.keys()  d.values()\nd | other  # merge (3.9+)', description: 'Common dictionary operations.', order: 4, isPublished: true },

  // Functions
  { languageSlug: 'python', category: 'Functions', title: 'Lambda', syntax: 'fn = lambda x, y: x + y', description: 'Anonymous single-expression function.', example: 'sorted(items, key=lambda x: x.name)', order: 1, isPublished: true },
  { languageSlug: 'python', category: 'Functions', title: '*args / **kwargs', syntax: 'def f(*args, **kwargs):\n    print(args)    # tuple\n    print(kwargs)  # dict', description: 'Accept variable positional and keyword arguments.', order: 2, isPublished: true },
  { languageSlug: 'python', category: 'Functions', title: 'Decorator', syntax: '@decorator\ndef fn(): ...', description: 'Wrap a function with another function.', example: 'from functools import wraps\ndef timer(fn):\n    @wraps(fn)\n    def wrapper(*a, **kw): ...', order: 3, isPublished: true },

  // Control Flow
  { languageSlug: 'python', category: 'Control Flow', title: 'Ternary', syntax: 'value = a if condition else b', description: 'Conditional expression (inline if/else).', order: 1, isPublished: true },
  { languageSlug: 'python', category: 'Control Flow', title: 'Walrus operator', syntax: 'if (n := len(data)) > 10:\n    print(f"Too long: {n}")', description: 'Assignment expression := (Python 3.8+).', order: 2, isPublished: true },
  { languageSlug: 'python', category: 'Control Flow', title: 'match/case', syntax: 'match command:\n    case "quit": exit()\n    case "go" | "move": walk()\n    case _: unknown()', description: 'Structural pattern matching (Python 3.10+).', order: 3, isPublished: true },

  // Error Handling
  { languageSlug: 'python', category: 'Error Handling', title: 'try/except', syntax: 'try:\n    risky()\nexcept ValueError as e:\n    handle(e)\nfinally:\n    cleanup()', description: 'Catch and handle exceptions.', order: 1, isPublished: true },
  { languageSlug: 'python', category: 'Error Handling', title: 'Context manager', syntax: 'with open("f.txt") as f:\n    data = f.read()', description: 'Automatic resource cleanup via __enter__/__exit__.', order: 2, isPublished: true },

  // Async
  { languageSlug: 'python', category: 'Async', title: 'async/await', syntax: 'import asyncio\n\nasync def fetch():\n    await asyncio.sleep(1)\n    return "done"\n\nasyncio.run(fetch())', description: 'Asynchronous coroutines and event loop.', order: 1, isPublished: true },
  { languageSlug: 'python', category: 'Async', title: 'asyncio.gather', syntax: 'results = await asyncio.gather(\n    fetch_a(), fetch_b(), fetch_c()\n)', description: 'Run multiple coroutines concurrently.', order: 2, isPublished: true },
];

// ─── JavaScript Cheat Sheet ──────────────────────────────────────────────────

const jsCheatSheetEntries: CheatSheetEntrySeed[] = [
  // Variables & Types
  { languageSlug: 'javascript', category: 'Variables & Types', title: 'let / const / var', syntax: 'const x = 1;  // block-scoped, immutable binding\nlet y = 2;    // block-scoped, reassignable\nvar z = 3;    // function-scoped (avoid)', description: 'Variable declaration keywords and their scoping rules.', order: 1, isPublished: true },
  { languageSlug: 'javascript', category: 'Variables & Types', title: 'typeof', syntax: "typeof 42         // 'number'\ntypeof 'hi'       // 'string'\ntypeof undefined  // 'undefined'\ntypeof null       // 'object' (historical bug)", description: 'Check runtime type of a value.', order: 2, isPublished: true },
  { languageSlug: 'javascript', category: 'Variables & Types', title: 'Nullish coalescing', syntax: 'const val = input ?? defaultValue;', description: 'Returns right side only if left is null or undefined (not 0 or "").', order: 3, isPublished: true },
  { languageSlug: 'javascript', category: 'Variables & Types', title: 'Optional chaining', syntax: 'user?.address?.city\narr?.[0]\nfn?.(arg)', description: 'Short-circuit to undefined if any part is null/undefined.', order: 4, isPublished: true },

  // Strings
  { languageSlug: 'javascript', category: 'Strings', title: 'Template literal', syntax: '`Hello ${name}, total: ${a + b}`', description: 'String interpolation with backticks.', example: '`Line 1\nLine 2`  // multiline', order: 1, isPublished: true },
  { languageSlug: 'javascript', category: 'Strings', title: 'String methods', syntax: 's.trim()  s.split(",")  s.includes("x")\ns.replaceAll("old", "new")\ns.padStart(5, "0")  s.at(-1)', description: 'Common string manipulation methods.', order: 2, isPublished: true },

  // Arrays
  { languageSlug: 'javascript', category: 'Arrays', title: 'map / filter / reduce', syntax: 'arr.map(x => x * 2)\narr.filter(x => x > 0)\narr.reduce((acc, x) => acc + x, 0)', description: 'Functional array transformations.', order: 1, isPublished: true },
  { languageSlug: 'javascript', category: 'Arrays', title: 'Destructuring', syntax: 'const [a, b, ...rest] = arr;\nconst [, second] = arr;  // skip first', description: 'Extract array elements into variables.', order: 2, isPublished: true },
  { languageSlug: 'javascript', category: 'Arrays', title: 'Spread', syntax: 'const merged = [...arr1, ...arr2];\nconst copy = [...arr];', description: 'Expand array elements into a new array.', order: 3, isPublished: true },
  { languageSlug: 'javascript', category: 'Arrays', title: 'find / findIndex', syntax: 'arr.find(x => x.id === 1)\narr.findIndex(x => x.id === 1)', description: 'Find first matching element or its index.', order: 4, isPublished: true },
  { languageSlug: 'javascript', category: 'Arrays', title: 'flat / flatMap', syntax: '[[1,2],[3]].flat()      // [1,2,3]\narr.flatMap(x => [x, x*2])', description: 'Flatten nested arrays, optionally with mapping.', order: 5, isPublished: true },

  // Objects
  { languageSlug: 'javascript', category: 'Objects', title: 'Destructuring', syntax: 'const { name, age = 0, ...rest } = obj;\nconst { name: userName } = obj;  // rename', description: 'Extract object properties into variables.', order: 1, isPublished: true },
  { languageSlug: 'javascript', category: 'Objects', title: 'Spread / merge', syntax: 'const merged = { ...defaults, ...overrides };\nconst copy = { ...obj };', description: 'Shallow copy and merge objects.', order: 2, isPublished: true },
  { languageSlug: 'javascript', category: 'Objects', title: 'Object.entries / fromEntries', syntax: 'Object.entries(obj)  // [[k,v], ...]\nObject.fromEntries(pairs)  // {k: v, ...}', description: 'Convert between objects and key-value pairs.', order: 3, isPublished: true },

  // Functions
  { languageSlug: 'javascript', category: 'Functions', title: 'Arrow function', syntax: 'const add = (a, b) => a + b;\nconst greet = name => `Hi ${name}`;', description: 'Concise function syntax with lexical this.', order: 1, isPublished: true },
  { languageSlug: 'javascript', category: 'Functions', title: 'Default / rest params', syntax: 'function f(a, b = 10, ...rest) {}', description: 'Default values and rest parameter collection.', order: 2, isPublished: true },

  // Async
  { languageSlug: 'javascript', category: 'Async', title: 'async/await', syntax: 'async function fetchData() {\n  const res = await fetch(url);\n  return res.json();\n}', description: 'Asynchronous functions that return Promises.', order: 1, isPublished: true },
  { languageSlug: 'javascript', category: 'Async', title: 'Promise.all / allSettled', syntax: 'await Promise.all([p1, p2, p3]);\nawait Promise.allSettled([p1, p2]);', description: 'Run promises concurrently. all() fails fast; allSettled() waits for all.', order: 2, isPublished: true },
  { languageSlug: 'javascript', category: 'Async', title: 'Promise.race / any', syntax: 'await Promise.race([p1, p2]);  // first settled\nawait Promise.any([p1, p2]);   // first fulfilled', description: 'Race promises: race() returns first settled, any() returns first success.', order: 3, isPublished: true },

  // Modules
  { languageSlug: 'javascript', category: 'Modules', title: 'import / export', syntax: "export const x = 1;\nexport default fn;\n\nimport fn, { x } from './mod.js';", description: 'ES module import/export syntax.', order: 1, isPublished: true },
  { languageSlug: 'javascript', category: 'Modules', title: 'Dynamic import', syntax: "const mod = await import('./heavy.js');", description: 'Lazy-load modules at runtime.', order: 2, isPublished: true },

  // Error Handling
  { languageSlug: 'javascript', category: 'Error Handling', title: 'try/catch', syntax: 'try {\n  riskyOp();\n} catch (err) {\n  console.error(err.message);\n} finally {\n  cleanup();\n}', description: 'Catch and handle exceptions.', order: 1, isPublished: true },
  { languageSlug: 'javascript', category: 'Error Handling', title: 'Error cause', syntax: "throw new Error('Failed', { cause: originalErr });", description: 'Chain errors with cause property (ES2022).', order: 2, isPublished: true },
];

// ─── Combined Export ─────────────────────────────────────────────────────────

export const cheatSheetEntries: CheatSheetEntrySeed[] = [
  ...jcrCheatSheetEntries,
  ...pythonCheatSheetEntries,
  ...jsCheatSheetEntries,
];
