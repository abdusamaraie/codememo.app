import { FeedWrapper, RightSidebar } from '@/components/layout';

export default function LearnPage() {
  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        <h1 className="text-2xl font-bold mb-2">Choose a Language</h1>
        <p className="text-[--muted-foreground] text-sm mb-6">
          Select a language to start memorizing syntax
        </p>
        <div className="grid gap-4">
          {[
            {
              name: 'Python',
              slug: 'python',
              color: '#3B82F6',
              desc: 'Master Python syntax — list comprehensions, decorators, and more.',
            },
            {
              name: 'TypeScript',
              slug: 'typescript',
              color: '#7C6AF6',
              desc: 'Level up your TypeScript — generics, utility types, and patterns.',
            },
            {
              name: 'JavaScript',
              slug: 'javascript',
              color: '#F59E0B',
              desc: 'Nail JavaScript fundamentals — closures, async, prototypes.',
            },
          ].map((lang) => (
            <div
              key={lang.slug}
              className="bg-[--card] border border-[--border] rounded-xl p-4 flex items-center gap-4 hover:border-[--primary] transition-colors cursor-pointer"
              style={{ borderLeftColor: lang.color, borderLeftWidth: '3px' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: lang.color }}
              >
                {lang.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[--foreground]">{lang.name}</div>
                <div className="text-sm text-[--muted-foreground] truncate">{lang.desc}</div>
              </div>
              <button className="text-sm font-medium text-[--primary] hover:underline shrink-0">
                Start →
              </button>
            </div>
          ))}
        </div>
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
