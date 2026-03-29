/**
 * Flashcard seed data — JCR-SQL2 (Adobe Experience Manager / Apache Jackrabbit).
 *
 * Every query has been verified against:
 *   - Jahia JCR-SQL2 Cheat Sheet: https://academy.jahia.com/documentation/jahia-cms/jahia-8.2/developer/leveraging-jahia-backend-capabilities/jcrsql2-query-cheat-sheet
 *   - Adobe JCR Query Cheat Sheet: https://experienceleague.adobe.com/docs/experience-manager-65/assets/JCR_query_cheatsheet-v1.1.pdf
 *   - JCR 2.0 Spec (JSR-283): https://docs.adobe.com/docs/en/spec/jcr/2.0/6_Query.html
 */

import type { FlashcardSeed } from './flashcards-python.js';

export const jcrFlashcards: FlashcardSeed[] = [
  // ── Core Syntax ───────────────────────────────────────────────────────────
  {
    sectionSlug: 'jcr-core-syntax',
    questionType: 'code-completion',
    front: {
      prompt: 'What is the basic JCR-SQL2 query skeleton?',
      language: 'sql',
    },
    back: {
      prompt: 'SELECT columns FROM [nodeType] AS alias WHERE conditions. The FROM clause requires a node type in square brackets.',
      code: "SELECT * FROM [nt:base] AS s\nWHERE ISDESCENDANTNODE(s, '/content')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['select', 'from', 'where', 'skeleton'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-core-syntax',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you use an alias in a JCR-SQL2 query to select all columns from a cq:Page?',
      language: 'sql',
    },
    back: {
      prompt: 'Use AS to define an alias, then prefix with alias.* to select all columns from that selector.',
      code: "SELECT s.* FROM [cq:Page] AS s\nWHERE ISDESCENDANTNODE(s, '/content')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['select', 'alias'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-core-syntax',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you select only the path and title columns from cq:Page nodes?',
      language: 'sql',
    },
    back: {
      prompt: 'List specific property names in the SELECT clause using square brackets for JCR property names.',
      code: "SELECT [jcr:path], [jcr:title]\nFROM [cq:Page] AS p\nWHERE ISDESCENDANTNODE(p, '/content')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 3,
    tags: ['select', 'columns', 'properties'],
    isPublished: true,
  },

  // ── Node Types ────────────────────────────────────────────────────────────
  {
    sectionSlug: 'jcr-node-types',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What node type matches ALL nodes in the JCR repository? (Use sparingly for performance)',
      language: 'sql',
    },
    back: {
      prompt: '[nt:base] is the base type that matches every node in the repository. It should be used sparingly as it scans everything.',
      code: "SELECT * FROM [nt:base] AS n\nWHERE ISDESCENDANTNODE(n, '/content')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['nt', 'base', 'node-type'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-node-types',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What node type do you query for AEM page nodes?',
      language: 'sql',
    },
    back: {
      prompt: '[cq:Page] represents AEM page nodes. These are the page structure nodes, not the content nodes.',
      code: "SELECT * FROM [cq:Page] AS p\nWHERE ISDESCENDANTNODE(p, '/content/mysite')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['cq', 'page', 'node-type'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-node-types',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What node type represents the jcr:content child of an AEM page, containing properties like cq:lastModified and cq:template?',
      language: 'sql',
    },
    back: {
      prompt: '[cq:PageContent] represents the jcr:content node under a cq:Page. It holds page-level metadata like template, last modified date, etc.',
      code: "SELECT * FROM [cq:PageContent] AS c\nWHERE ISDESCENDANTNODE(c, '/content')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 3,
    tags: ['cq', 'pagecontent', 'node-type'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-node-types',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What node type is used for DAM assets (images, PDFs, etc.) in AEM?',
      language: 'sql',
    },
    back: {
      prompt: '[dam:Asset] represents Digital Asset Management nodes. Found under /content/dam.',
      code: "SELECT * FROM [dam:Asset] AS a\nWHERE ISDESCENDANTNODE(a, '/content/dam')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 4,
    tags: ['dam', 'asset', 'node-type'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-node-types',
    questionType: 'multiple-choice',
    front: {
      prompt: 'Which node type would you use to find component definition nodes in /apps?',
    },
    back: {
      prompt: '[cq:Component] represents component definitions stored under /apps or /libs.',
      code: "SELECT * FROM [cq:Component] AS c\nWHERE ISDESCENDANTNODE(c, '/apps')",
      language: 'sql',
    },
    difficulty: 'intermediate',
    order: 5,
    tags: ['cq', 'component', 'node-type'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-node-types',
    questionType: 'multiple-choice',
    front: {
      prompt: 'Which node type represents generic content nodes and components (the most common node type for content)?',
    },
    back: {
      prompt: '[nt:unstructured] is used for generic content nodes. Most AEM component content nodes use this type.',
      code: "SELECT * FROM [nt:unstructured] AS n\nWHERE ISDESCENDANTNODE(n, '/content')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 6,
    tags: ['nt', 'unstructured', 'node-type'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-node-types',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What node type do you query to find user nodes in /home/users?',
      language: 'sql',
    },
    back: {
      prompt: '[rep:User] represents user nodes in the repository, stored under /home/users.',
      code: "SELECT * FROM [rep:User] AS u\nWHERE ISDESCENDANTNODE(u, '/home/users')",
      language: 'sql',
    },
    difficulty: 'intermediate',
    order: 7,
    tags: ['rep', 'user', 'node-type'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-node-types',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What node type is used for client library folders in AEM?',
      language: 'sql',
    },
    back: {
      prompt: '[cq:ClientLibraryFolder] represents clientlib folders that hold CSS/JS bundles.',
      code: "SELECT * FROM [cq:ClientLibraryFolder] AS c\nWHERE ISDESCENDANTNODE(c, '/apps')",
      language: 'sql',
    },
    difficulty: 'intermediate',
    order: 8,
    tags: ['cq', 'clientlib', 'node-type'],
    isPublished: true,
  },

  // ── Path Functions ────────────────────────────────────────────────────────
  {
    sectionSlug: 'jcr-path-functions',
    questionType: 'code-completion',
    front: {
      prompt: 'Which path function matches nodes at any depth beneath a given path?',
      language: 'sql',
    },
    back: {
      prompt: 'ISDESCENDANTNODE(selector, path) matches all nodes at any depth below the specified path. This is the most commonly used path function.',
      code: "SELECT * FROM [cq:Page] AS p\nWHERE ISDESCENDANTNODE(p, '/content/mysite')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['path', 'isdescendantnode', 'function'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-path-functions',
    questionType: 'code-completion',
    front: {
      prompt: 'Which path function matches only direct children (one level deep) of a given path?',
      language: 'sql',
    },
    back: {
      prompt: 'ISCHILDNODE(selector, path) matches only direct children — one level beneath the specified path.',
      code: "SELECT * FROM [nt:base] AS n\nWHERE ISCHILDNODE(n, '/content/dam')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['path', 'ischildnode', 'function'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-path-functions',
    questionType: 'code-completion',
    front: {
      prompt: 'Which path function matches an exact node path?',
      language: 'sql',
    },
    back: {
      prompt: 'ISSAMENODE(selector, path) matches only the node at the exact specified path.',
      code: "SELECT * FROM [nt:base] AS n\nWHERE ISSAMENODE(n, '/content/mysite/en')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 3,
    tags: ['path', 'issamenode', 'function'],
    isPublished: true,
  },

  // ── Text & Search Functions ───────────────────────────────────────────────
  {
    sectionSlug: 'jcr-text-search',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you perform a full-text search across all indexed properties of a node?',
      language: 'sql',
    },
    back: {
      prompt: 'CONTAINS(*, \'term\') searches all indexed full-text properties. The asterisk means "all properties".',
      code: "SELECT * FROM [nt:base] AS n\nWHERE CONTAINS(*, 'search term')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['contains', 'fulltext', 'function'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-text-search',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you perform a full-text search on a specific property only?',
      language: 'sql',
    },
    back: {
      prompt: 'CONTAINS([property], \'term\') restricts full-text search to a single property.',
      code: "SELECT * FROM [cq:Page] AS p\nWHERE CONTAINS([jcr:title], 'welcome')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['contains', 'fulltext', 'property', 'function'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-text-search',
    questionType: 'code-completion',
    front: {
      prompt: 'What does the LIKE operator do and what are its wildcard characters?',
      language: 'sql',
    },
    back: {
      prompt: 'LIKE performs pattern matching. % matches any number of characters, _ matches exactly one character. Avoid leading % for performance.',
      code: "SELECT * FROM [nt:file] AS f\nWHERE [jcr:title] LIKE 'Home%'",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 3,
    tags: ['like', 'wildcard', 'operator'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-text-search',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you use the NAME() function to match node names?',
      language: 'sql',
    },
    back: {
      prompt: 'NAME() returns the node name with namespace prefix. NAME(selector) returns the name for a specific selector.',
      code: "SELECT * FROM [nt:file] AS f\nWHERE NAME(f) LIKE '%.png'",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 4,
    tags: ['name', 'function'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-text-search',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What function returns a node name WITHOUT its namespace prefix?',
      language: 'sql',
    },
    back: {
      prompt: 'LOCALNAME() returns the node name stripped of its namespace prefix. E.g. for "jcr:content" it returns "content".',
      code: "SELECT * FROM [nt:base] AS n\nWHERE LOCALNAME() = 'content'",
      language: 'sql',
    },
    difficulty: 'intermediate',
    order: 5,
    tags: ['localname', 'function'],
    isPublished: true,
  },

  // ── Operators & Conditions ────────────────────────────────────────────────
  {
    sectionSlug: 'jcr-operators',
    questionType: 'true-false',
    front: {
      prompt: 'In JCR-SQL2, IS NULL checks whether a property does not exist on a node.',
    },
    back: {
      prompt: 'True. IS NULL returns nodes where the specified property does not exist. IS NOT NULL returns nodes where the property exists.',
      code: "SELECT * FROM [cq:Page] AS p\nWHERE p.[jcr:description] IS NULL",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['isnull', 'operator', 'comparison'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-operators',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you combine conditions so BOTH must be true?',
      language: 'sql',
    },
    back: {
      prompt: 'Use the AND operator between conditions. Both sides must evaluate to true.',
      code: "SELECT * FROM [cq:Page] AS p\nWHERE p.[jcr:title] = 'Home'\n  AND ISDESCENDANTNODE(p, '/content')",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['and', 'operator', 'logical'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-operators',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you group conditions with parentheses in JCR-SQL2?',
      language: 'sql',
    },
    back: {
      prompt: 'Use parentheses to control evaluation order, just like in SQL. This is essential when mixing AND and OR.',
      code: "SELECT * FROM [cq:Page] AS p\nWHERE (p.[a] = 1 OR p.[b] = 2)\n  AND p.[c] = 3",
      language: 'sql',
    },
    difficulty: 'intermediate',
    order: 3,
    tags: ['parentheses', 'operator', 'logical'],
    isPublished: true,
  },

  // ── Ordering & Pseudo Columns ─────────────────────────────────────────────
  {
    sectionSlug: 'jcr-ordering-pseudo',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you sort JCR-SQL2 results by creation date, newest first?',
      language: 'sql',
    },
    back: {
      prompt: 'Use ORDER BY with DESC for descending order (newest first).',
      code: "SELECT * FROM [cq:Page] AS p\nWHERE ISDESCENDANTNODE(p, '/content')\nORDER BY p.[jcr:created] DESC",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['orderby', 'desc', 'sorting'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-ordering-pseudo',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you sort results by full-text relevance score?',
      language: 'sql',
    },
    back: {
      prompt: '[jcr:score] is a pseudo column available when using CONTAINS(). Order by it descending for most relevant results first.',
      code: "SELECT * FROM [nt:base] AS n\nWHERE CONTAINS(*, 'term')\nORDER BY [jcr:score] DESC",
      language: 'sql',
    },
    difficulty: 'intermediate',
    order: 2,
    tags: ['orderby', 'score', 'sorting', 'fulltext'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-ordering-pseudo',
    questionType: 'multiple-choice',
    front: {
      prompt: 'Which of these is NOT a JCR pseudo column?',
    },
    back: {
      prompt: '[jcr:path], [jcr:score], [jcr:primaryType], [jcr:mixinTypes], and [jcr:uuid] are pseudo columns. [jcr:title] is a regular property, not a pseudo column.',
    },
    difficulty: 'intermediate',
    order: 3,
    tags: ['pseudo', 'column'],
    isPublished: true,
  },

  // ── Common Properties ─────────────────────────────────────────────────────
  {
    sectionSlug: 'jcr-common-properties',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What property stores the page template path in AEM page content nodes?',
      language: 'sql',
    },
    back: {
      prompt: '[cq:template] stores the path to the template definition used by the page.',
      code: "SELECT * FROM [cq:PageContent] AS c\nWHERE c.[cq:template] = '/conf/mysite/templates/page'",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['cq', 'template', 'property'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-common-properties',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What property identifies the component resource type of a content node?',
      language: 'sql',
    },
    back: {
      prompt: '[sling:resourceType] identifies which component renders the node. It maps to a component under /apps or /libs.',
      code: "SELECT * FROM [nt:unstructured] AS c\nWHERE c.[sling:resourceType] = 'myapp/components/text'",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['sling', 'resourcetype', 'property'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-common-properties',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What property stores the MIME type for DAM assets?',
      language: 'sql',
    },
    back: {
      prompt: '[dc:format] holds the MIME type (e.g. "image/png", "application/pdf"). Part of the Dublin Core metadata standard.',
      code: "SELECT * FROM [dam:Asset] AS a\nWHERE a.[dc:format] = 'image/png'",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 3,
    tags: ['dc', 'format', 'property', 'dam'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-common-properties',
    questionType: 'multiple-choice',
    front: {
      prompt: 'What does the [cq:lastReplicationAction] property indicate?',
    },
    back: {
      prompt: 'It stores the last replication action: "Activate" (published), "Deactivate" (unpublished), or "Delete" (deleted from publish).',
      code: "SELECT * FROM [cq:PageContent] AS c\nWHERE c.[cq:lastReplicationAction] = 'Activate'",
      language: 'sql',
    },
    difficulty: 'intermediate',
    order: 4,
    tags: ['cq', 'replication', 'property'],
    isPublished: true,
  },

  // ── CAST & Type Conversion ────────────────────────────────────────────────
  {
    sectionSlug: 'jcr-cast-types',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you filter nodes by a date property (e.g. modified after Jan 1, 2024)?',
      language: 'sql',
    },
    back: {
      prompt: 'Use CAST(\'...\' AS DATE) to convert a string to a date for comparison.',
      code: "SELECT * FROM [cq:PageContent] AS c\nWHERE c.[cq:lastModified] >= CAST('2024-01-01T00:00:00.000Z' AS DATE)",
      language: 'sql',
    },
    difficulty: 'intermediate',
    order: 1,
    tags: ['cast', 'date', 'function'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-cast-types',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you cast a numeric property to a LONG for comparison?',
      language: 'sql',
    },
    back: {
      prompt: 'Use CAST(property AS LONG) to convert to a numeric type for comparison.',
      code: "SELECT * FROM [nt:base] AS n\nWHERE CAST(n.[value] AS LONG) > 100",
      language: 'sql',
    },
    difficulty: 'intermediate',
    order: 2,
    tags: ['cast', 'long', 'function'],
    isPublished: true,
  },

  // ── JOINs ─────────────────────────────────────────────────────────────────
  {
    sectionSlug: 'jcr-joins',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you write an INNER JOIN in JCR-SQL2 to join a page with its child nodes?',
      language: 'sql',
    },
    back: {
      prompt: 'Use INNER JOIN with ON ISCHILDNODE(child, parent) to join a page with its direct children.',
      code: "SELECT parent.* FROM [cq:Page] AS parent\nINNER JOIN [nt:base] AS child\n  ON ISCHILDNODE(child, parent)\nWHERE ISDESCENDANTNODE(parent, '/content')",
      language: 'sql',
    },
    difficulty: 'advanced',
    order: 1,
    tags: ['join', 'inner', 'function'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-joins',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you write a LEFT OUTER JOIN to get pages with their optional content nodes?',
      language: 'sql',
    },
    back: {
      prompt: 'LEFT OUTER JOIN returns all rows from the left side (pages) and matching rows from the right side (content). Non-matching right rows return NULL.',
      code: "SELECT p.*, c.* FROM [cq:Page] AS p\nLEFT OUTER JOIN [cq:PageContent] AS c\n  ON ISCHILDNODE(c, p)\nWHERE ISDESCENDANTNODE(p, '/content')",
      language: 'sql',
    },
    difficulty: 'advanced',
    order: 2,
    tags: ['join', 'leftouter', 'function'],
    isPublished: true,
  },

  // ── Real-World AEM Queries ────────────────────────────────────────────────
  {
    sectionSlug: 'jcr-real-world',
    questionType: 'code-completion',
    front: {
      prompt: 'Write a query to find all pages using a specific template.',
      language: 'sql',
    },
    back: {
      prompt: 'Query cq:PageContent and filter by the cq:template property.',
      code: "SELECT * FROM [cq:PageContent] AS c\nWHERE c.[cq:template] = '/conf/mysite/templates/page'\n  AND ISDESCENDANTNODE(c, '/content/mysite')",
      language: 'sql',
    },
    difficulty: 'intermediate',
    order: 1,
    tags: ['real-world', 'template', 'aem'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-real-world',
    questionType: 'code-completion',
    front: {
      prompt: 'Write a query to find all PNG images in the DAM.',
      language: 'sql',
    },
    back: {
      prompt: 'Query dam:Asset and filter by dc:format for the image/png MIME type.',
      code: "SELECT * FROM [dam:Asset] AS a\nWHERE ISDESCENDANTNODE(a, '/content/dam')\n  AND a.[dc:format] = 'image/png'",
      language: 'sql',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['real-world', 'dam', 'asset', 'format'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-real-world',
    questionType: 'code-completion',
    front: {
      prompt: 'Write a query to find all components of a specific resource type under /content.',
      language: 'sql',
    },
    back: {
      prompt: 'Query nt:unstructured and filter by sling:resourceType.',
      code: "SELECT * FROM [nt:unstructured] AS c\nWHERE ISDESCENDANTNODE(c, '/content/we-retail')\n  AND c.[sling:resourceType] = 'weretail/components/content/text'",
      language: 'sql',
    },
    difficulty: 'intermediate',
    order: 3,
    tags: ['real-world', 'sling', 'resourcetype', 'component'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-real-world',
    questionType: 'code-completion',
    front: {
      prompt: 'Write a query to find all published (activated) pages.',
      language: 'sql',
    },
    back: {
      prompt: 'Query cq:PageContent and filter by cq:lastReplicationAction = \'Activate\'.',
      code: "SELECT * FROM [cq:PageContent] AS c\nWHERE c.[cq:lastReplicationAction] = 'Activate'\n  AND ISDESCENDANTNODE(c, '/content/mysite')",
      language: 'sql',
    },
    difficulty: 'intermediate',
    order: 4,
    tags: ['real-world', 'replication', 'activate', 'publish'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-real-world',
    questionType: 'code-completion',
    front: {
      prompt: 'Write a full-text search query that returns results sorted by relevance.',
      language: 'sql',
    },
    back: {
      prompt: 'Use CONTAINS for full-text search and ORDER BY [jcr:score] DESC for relevance ranking.',
      code: "SELECT [jcr:path], [jcr:score] FROM [nt:base] AS n\nWHERE ISDESCENDANTNODE(n, '/content')\n  AND CONTAINS(n.*, 'welcome')\nORDER BY [jcr:score] DESC",
      language: 'sql',
    },
    difficulty: 'advanced',
    order: 5,
    tags: ['real-world', 'fulltext', 'score', 'relevance'],
    isPublished: true,
  },
  {
    sectionSlug: 'jcr-real-world',
    questionType: 'code-completion',
    front: {
      prompt: 'Write a query to find pages modified after a specific date, sorted by most recently modified.',
      language: 'sql',
    },
    back: {
      prompt: 'Use CAST for date comparison and ORDER BY DESC for newest first.',
      code: "SELECT * FROM [cq:PageContent] AS c\nWHERE c.[cq:lastModified] >= CAST('2024-01-01T00:00:00.000Z' AS DATE)\n  AND ISDESCENDANTNODE(c, '/content')\nORDER BY c.[cq:lastModified] DESC",
      language: 'sql',
    },
    difficulty: 'advanced',
    order: 6,
    tags: ['real-world', 'date', 'cast', 'modified'],
    isPublished: true,
  },
];
