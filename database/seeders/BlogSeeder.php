<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('user_type', 'admin')->first();

        $blogs = [
            [
                'title' => 'Top 10 Tips for Writing an Impressive Resume',
                'excerpt' => 'Learn how to create a resume that stands out from the crowd and gets you noticed by employers.',
                'content' => "# Top 10 Tips for Writing an Impressive Resume\n\nYour resume is often the first impression you make on a potential employer. Here are our top tips for creating a resume that gets results:\n\n## 1. Tailor Your Resume to Each Job\nCustomize your resume for each position you apply to. Highlight the skills and experiences most relevant to the specific job.\n\n## 2. Use Action Verbs\nStart bullet points with strong action verbs like \"developed,\" \"managed,\" \"implemented,\" or \"achieved.\"\n\n## 3. Quantify Your Achievements\nUse numbers to demonstrate your impact. Instead of \"improved sales,\" write \"increased sales by 25% over 6 months.\"\n\n## 4. Keep It Concise\nMost recruiters spend only 6-7 seconds on an initial resume scan. Keep your resume to 1-2 pages maximum.\n\n## 5. Use Professional Formatting\nChoose a clean, professional font and consistent formatting. Use adequate white space for readability.\n\n## 6. Include Relevant Keywords\nMany companies use ATS (Applicant Tracking Systems). Include keywords from the job description to pass automated screening.\n\n## 7. Proofread Carefully\nTypos and grammatical errors can disqualify you immediately. Have someone else review your resume.\n\n## 8. Include a Professional Summary\nA brief 2-3 sentence summary at the top can quickly convey your value proposition.\n\n## 9. Focus on Recent Experience\nEmphasize your most recent and relevant positions. Older roles can be summarized briefly.\n\n## 10. Update Your Contact Information\nEnsure your email, phone number, and LinkedIn profile are current and professional.",
                'category' => 'Career Tips',
                'tags' => ['resume', 'job-search', 'career-tips'],
            ],
            [
                'title' => 'How to Ace Your Next Job Interview',
                'excerpt' => 'Prepare yourself for success with these proven interview strategies and techniques.',
                'content' => "# How to Ace Your Next Job Interview\n\nJob interviews can be nerve-wracking, but with proper preparation, you can make a great impression.\n\n## Before the Interview\n\n### Research the Company\nUnderstand the company's mission, values, recent news, and industry position.\n\n### Practice Common Questions\nPrepare answers for questions like:\n- Tell me about yourself\n- Why do you want to work here?\n- What are your strengths and weaknesses?\n- Where do you see yourself in 5 years?\n\n### Prepare Your Own Questions\nHave thoughtful questions ready for the interviewer about the role, team, and company culture.\n\n## During the Interview\n\n### First Impressions Matter\n- Arrive 10-15 minutes early\n- Dress appropriately for the company culture\n- Bring copies of your resume\n\n### Use the STAR Method\nWhen answering behavioral questions, structure your responses:\n- **S**ituation: Set the context\n- **T**ask: Describe your responsibility\n- **A**ction: Explain what you did\n- **R**esult: Share the outcome\n\n### Show Enthusiasm\nExpress genuine interest in the role and company. Enthusiasm is contagious!\n\n## After the Interview\n\n### Send a Thank You Note\nWithin 24 hours, send a personalized thank you email to each interviewer.\n\n### Follow Up Appropriately\nIf you haven't heard back within the stated timeframe, a polite follow-up is acceptable.",
                'category' => 'Interview Tips',
                'tags' => ['interview', 'job-search', 'career-tips'],
            ],
            [
                'title' => 'The Future of Remote Work in Kenya',
                'excerpt' => 'Explore how remote work is transforming the Kenyan job market and what it means for job seekers.',
                'content' => "# The Future of Remote Work in Kenya\n\nThe global pandemic accelerated the adoption of remote work worldwide, and Kenya is no exception. Here's what the future holds:\n\n## Current State of Remote Work\n\nMany Kenyan companies have embraced flexible work arrangements. Tech companies, in particular, have led the way in offering remote and hybrid options.\n\n## Benefits for Kenyan Workers\n\n### Expanded Opportunities\nRemote work opens doors to international job opportunities. Kenyan professionals can now work for companies across the globe.\n\n### Work-Life Balance\nNo commuting means more time for family, health, and personal pursuits.\n\n### Cost Savings\nBoth employers and employees save on transportation, office space, and related expenses.\n\n## Challenges to Address\n\n### Internet Connectivity\nReliable, high-speed internet remains a challenge in some areas.\n\n### Workspace Setup\nNot everyone has access to a quiet, dedicated workspace at home.\n\n### Time Zone Management\nWorking with international teams requires flexibility in scheduling.\n\n## Skills for Remote Success\n\n- Strong written communication\n- Self-discipline and time management\n- Proficiency with digital collaboration tools\n- Ability to work independently\n\n## Looking Ahead\n\nRemote work is here to stay. Companies that embrace flexibility will attract top talent, and workers who develop remote work skills will have a competitive advantage in the job market.",
                'category' => 'Industry Trends',
                'tags' => ['remote-work', 'future-of-work', 'kenya'],
            ],
            [
                'title' => 'Building Your Personal Brand on LinkedIn',
                'excerpt' => 'Maximize your LinkedIn presence to attract recruiters and career opportunities.',
                'content' => "# Building Your Personal Brand on LinkedIn\n\nLinkedIn is the world's largest professional network. Here's how to make it work for your career:\n\n## Optimize Your Profile\n\n### Professional Photo\nProfiles with photos get 21x more views. Use a clear, professional headshot.\n\n### Compelling Headline\nDon't just use your job title. Create a headline that showcases your value proposition.\n\n### Detailed Summary\nTell your professional story. What drives you? What problems do you solve?\n\n### Rich Experience Section\nDon't just list responsibilities—highlight achievements and quantify results.\n\n## Build Your Network\n\n### Connect Strategically\nConnect with colleagues, industry peers, and professionals in your target companies.\n\n### Engage Regularly\nLike, comment, and share relevant content. Active engagement increases visibility.\n\n### Join Groups\nParticipate in industry-specific groups to expand your network and stay informed.\n\n## Share Valuable Content\n\n### Original Posts\nShare your insights, experiences, and lessons learned.\n\n### Industry Commentary\nProvide thoughtful commentary on industry news and trends.\n\n### Professional Updates\nCelebrate achievements, share projects, and acknowledge team members.\n\n## Leverage LinkedIn Features\n\n- Use the \"Open to Work\" feature discretely if job searching\n- Request recommendations from colleagues and managers\n- Take skill assessments to earn badges\n- Consider LinkedIn Premium for additional features",
                'category' => 'Career Development',
                'tags' => ['linkedin', 'personal-branding', 'networking'],
            ],
        ];

        foreach ($blogs as $blogData) {
            Blog::create([
                'author_id' => $admin->id,
                'title' => $blogData['title'],
                'slug' => Str::slug($blogData['title']),
                'excerpt' => $blogData['excerpt'],
                'content' => $blogData['content'],
                'category' => $blogData['category'],
                'tags' => $blogData['tags'],
                'status' => 'published',
                'published_at' => now()->subDays(rand(1, 30)),
                'views_count' => rand(50, 500),
            ]);
        }
    }
}
