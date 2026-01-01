<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Smalot\PdfParser\Parser as PdfParser;

class CVParserService
{
    /**
     * Common skill keywords to extract.
     */
    private array $skillKeywords = [
        // Programming Languages
        'javascript', 'typescript', 'python', 'java', 'php', 'ruby', 'c++', 'c#', 'swift',
        'kotlin', 'go', 'rust', 'scala', 'perl', 'r', 'matlab', 'shell', 'bash',

        // Web Technologies
        'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'jquery',

        // Frameworks
        'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'gatsby',
        'laravel', 'symfony', 'django', 'flask', 'fastapi', 'express', 'nestjs',
        'spring', 'spring boot', 'rails', 'asp.net', '.net core',

        // Databases
        'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'sqlite',
        'oracle', 'sql server', 'cassandra', 'dynamodb', 'firebase',

        // Cloud & DevOps
        'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform',
        'ansible', 'jenkins', 'circleci', 'github actions', 'gitlab ci',

        // Tools & Platforms
        'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack',
        'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator',

        // Methodologies
        'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'tdd', 'bdd',

        // Data & ML
        'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
        'pandas', 'numpy', 'scikit-learn', 'data analysis', 'data science',
        'big data', 'spark', 'hadoop',

        // Mobile
        'react native', 'flutter', 'ios', 'android', 'swift', 'kotlin',

        // Other
        'api', 'rest', 'graphql', 'microservices', 'websocket', 'oauth',
        'linux', 'unix', 'windows server',
    ];

    /**
     * Education keywords to detect.
     */
    private array $educationKeywords = [
        'bachelor', 'master', 'phd', 'doctorate', 'diploma', 'degree',
        'university', 'college', 'institute', 'school', 'academy',
        'bsc', 'msc', 'ba', 'ma', 'mba', 'btech', 'mtech',
        'computer science', 'engineering', 'information technology', 'business',
    ];

    /**
     * Parse a CV/Resume file and extract structured data.
     */
    public function parse(string $filePath): array
    {
        try {
            $content = $this->extractText($filePath);

            if (empty($content)) {
                return $this->getEmptyResult();
            }

            return [
                'success' => true,
                'data' => [
                    'raw_text' => $content,
                    'contact' => $this->extractContactInfo($content),
                    'skills' => $this->extractSkills($content),
                    'education' => $this->extractEducation($content),
                    'experience' => $this->extractExperience($content),
                    'summary' => $this->extractSummary($content),
                    'languages' => $this->extractLanguages($content),
                    'certifications' => $this->extractCertifications($content),
                ],
            ];
        } catch (\Exception $e) {
            Log::error('CV parsing failed', [
                'file' => $filePath,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => 'Failed to parse CV: ' . $e->getMessage(),
                'data' => $this->getEmptyResult()['data'],
            ];
        }
    }

    /**
     * Extract text content from file.
     */
    private function extractText(string $filePath): string
    {
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $fullPath = Storage::path($filePath);

        if (!file_exists($fullPath)) {
            throw new \Exception('File not found: ' . $filePath);
        }

        switch ($extension) {
            case 'pdf':
                return $this->extractFromPdf($fullPath);
            case 'doc':
            case 'docx':
                return $this->extractFromDoc($fullPath);
            case 'txt':
                return file_get_contents($fullPath);
            default:
                throw new \Exception('Unsupported file format: ' . $extension);
        }
    }

    /**
     * Extract text from PDF file.
     */
    private function extractFromPdf(string $path): string
    {
        if (!class_exists(PdfParser::class)) {
            // Fallback: try shell command
            $output = shell_exec("pdftotext '{$path}' -");
            return $output ?? '';
        }

        $parser = new PdfParser();
        $pdf = $parser->parseFile($path);
        return $pdf->getText();
    }

    /**
     * Extract text from DOC/DOCX file.
     */
    private function extractFromDoc(string $path): string
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        if ($extension === 'docx') {
            return $this->extractFromDocx($path);
        }

        // For .doc files, try shell command
        $output = shell_exec("antiword '{$path}' 2>/dev/null");
        if ($output) {
            return $output;
        }

        // Fallback to catdoc
        $output = shell_exec("catdoc '{$path}' 2>/dev/null");
        return $output ?? '';
    }

    /**
     * Extract text from DOCX file.
     */
    private function extractFromDocx(string $path): string
    {
        $zip = new \ZipArchive();
        if ($zip->open($path) === true) {
            $content = $zip->getFromName('word/document.xml');
            $zip->close();

            if ($content) {
                // Strip XML tags and clean up
                $text = strip_tags($content);
                $text = preg_replace('/\s+/', ' ', $text);
                return trim($text);
            }
        }

        return '';
    }

    /**
     * Extract contact information.
     */
    private function extractContactInfo(string $content): array
    {
        $contact = [
            'email' => null,
            'phone' => null,
            'linkedin' => null,
            'github' => null,
            'website' => null,
            'address' => null,
        ];

        // Email
        if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $content, $matches)) {
            $contact['email'] = strtolower($matches[0]);
        }

        // Phone (various formats)
        $phonePatterns = [
            '/\+?[\d\s\-\(\)]{10,}/',
            '/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/',
            '/\b\d{10,12}\b/',
        ];
        foreach ($phonePatterns as $pattern) {
            if (preg_match($pattern, $content, $matches)) {
                $phone = preg_replace('/[^\d+]/', '', $matches[0]);
                if (strlen($phone) >= 10) {
                    $contact['phone'] = $phone;
                    break;
                }
            }
        }

        // LinkedIn
        if (preg_match('/linkedin\.com\/in\/([a-zA-Z0-9\-]+)/', $content, $matches)) {
            $contact['linkedin'] = 'https://linkedin.com/in/' . $matches[1];
        }

        // GitHub
        if (preg_match('/github\.com\/([a-zA-Z0-9\-]+)/', $content, $matches)) {
            $contact['github'] = 'https://github.com/' . $matches[1];
        }

        // Website
        if (preg_match('/https?:\/\/(?!linkedin|github)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}/', $content, $matches)) {
            $contact['website'] = $matches[0];
        }

        return $contact;
    }

    /**
     * Extract skills from content.
     */
    private function extractSkills(string $content): array
    {
        $content = strtolower($content);
        $foundSkills = [];

        foreach ($this->skillKeywords as $skill) {
            $pattern = '/\b' . preg_quote($skill, '/') . '\b/i';
            if (preg_match($pattern, $content)) {
                $foundSkills[] = ucwords($skill);
            }
        }

        // Also look for skills section
        if (preg_match('/skills?\s*[:\-]?\s*([^\n]+(?:\n(?![A-Z])[^\n]+)*)/i', $content, $matches)) {
            $skillsText = $matches[1];
            $additionalSkills = preg_split('/[,;|•·]/', $skillsText);
            foreach ($additionalSkills as $skill) {
                $skill = trim($skill);
                if (strlen($skill) > 2 && strlen($skill) < 50) {
                    $foundSkills[] = ucwords($skill);
                }
            }
        }

        return array_unique($foundSkills);
    }

    /**
     * Extract education information.
     */
    private function extractEducation(string $content): array
    {
        $education = [];

        // Look for education section
        $educationSection = '';
        if (preg_match('/education\s*[:\-]?\s*(.+?)(?=experience|skills|projects|certifications|$)/is', $content, $matches)) {
            $educationSection = $matches[1];
        }

        // Extract degrees
        $degreePatterns = [
            '/(?:bachelor|b\.?s\.?|b\.?a\.?|bsc|ba)\s*(?:of|in)?\s*([^\n,]+)/i',
            '/(?:master|m\.?s\.?|m\.?a\.?|msc|ma|mba)\s*(?:of|in)?\s*([^\n,]+)/i',
            '/(?:phd|ph\.d\.?|doctorate)\s*(?:of|in)?\s*([^\n,]+)/i',
            '/(?:diploma|certificate)\s*(?:of|in)?\s*([^\n,]+)/i',
        ];

        $searchText = $educationSection ?: $content;

        foreach ($degreePatterns as $pattern) {
            if (preg_match_all($pattern, $searchText, $matches)) {
                foreach ($matches[0] as $i => $match) {
                    $education[] = [
                        'degree' => ucwords(trim($match)),
                        'field' => ucwords(trim($matches[1][$i] ?? '')),
                        'institution' => null, // Would need more context
                        'year' => $this->extractYear($match),
                    ];
                }
            }
        }

        return $education;
    }

    /**
     * Extract work experience.
     */
    private function extractExperience(string $content): array
    {
        $experience = [];

        // Look for experience section
        $experienceSection = '';
        if (preg_match('/(?:work\s+)?experience\s*[:\-]?\s*(.+?)(?=education|skills|projects|certifications|references|$)/is', $content, $matches)) {
            $experienceSection = $matches[1];
        }

        if (empty($experienceSection)) {
            return $experience;
        }

        // Try to split by common patterns (dates, bullet points)
        $entries = preg_split('/(?=\d{4}\s*[-–]\s*(?:\d{4}|present|current))/i', $experienceSection);

        foreach ($entries as $entry) {
            if (strlen(trim($entry)) < 20) {
                continue;
            }

            $exp = [
                'title' => null,
                'company' => null,
                'duration' => null,
                'description' => trim($entry),
            ];

            // Extract date range
            if (preg_match('/(\d{4})\s*[-–]\s*(\d{4}|present|current)/i', $entry, $matches)) {
                $exp['duration'] = $matches[0];
            }

            // Try to extract job title (usually appears before company)
            if (preg_match('/^([A-Z][^\n]+?)(?:\s+at\s+|\s*[-–]\s*|\s*@\s*)/i', trim($entry), $matches)) {
                $exp['title'] = trim($matches[1]);
            }

            $experience[] = $exp;
        }

        return array_slice($experience, 0, 10); // Limit to 10 entries
    }

    /**
     * Extract professional summary.
     */
    private function extractSummary(string $content): ?string
    {
        $summaryPatterns = [
            '/(?:summary|profile|objective|about\s+me)\s*[:\-]?\s*([^\n]+(?:\n(?![A-Z])[^\n]+)*)/i',
        ];

        foreach ($summaryPatterns as $pattern) {
            if (preg_match($pattern, $content, $matches)) {
                $summary = trim($matches[1]);
                if (strlen($summary) > 50) {
                    return substr($summary, 0, 1000);
                }
            }
        }

        // Fallback: First paragraph
        $paragraphs = preg_split('/\n\s*\n/', $content);
        foreach ($paragraphs as $para) {
            $para = trim($para);
            if (strlen($para) > 100 && strlen($para) < 1000) {
                return $para;
            }
        }

        return null;
    }

    /**
     * Extract languages spoken.
     */
    private function extractLanguages(string $content): array
    {
        $languages = [];
        $commonLanguages = [
            'english', 'spanish', 'french', 'german', 'chinese', 'mandarin',
            'japanese', 'korean', 'arabic', 'portuguese', 'russian', 'italian',
            'dutch', 'hindi', 'swahili', 'turkish', 'polish', 'swedish',
        ];

        $content = strtolower($content);

        foreach ($commonLanguages as $language) {
            if (preg_match('/\b' . $language . '\b/', $content)) {
                $languages[] = ucfirst($language);
            }
        }

        return $languages;
    }

    /**
     * Extract certifications.
     */
    private function extractCertifications(string $content): array
    {
        $certifications = [];

        // Look for certification section
        if (preg_match('/certifications?\s*[:\-]?\s*(.+?)(?=experience|education|skills|projects|$)/is', $content, $matches)) {
            $certSection = $matches[1];
            $lines = preg_split('/[\n•·]/', $certSection);

            foreach ($lines as $line) {
                $line = trim($line);
                if (strlen($line) > 5 && strlen($line) < 200) {
                    $certifications[] = $line;
                }
            }
        }

        // Also look for common certification keywords
        $certPatterns = [
            '/(?:AWS|Amazon Web Services)\s+(?:Certified\s+)?[A-Za-z\s]+/i',
            '/(?:Google|GCP)\s+(?:Cloud\s+)?(?:Certified\s+)?[A-Za-z\s]+/i',
            '/(?:Azure|Microsoft)\s+(?:Certified\s+)?[A-Za-z\s]+/i',
            '/PMP|Project Management Professional/i',
            '/Scrum Master|CSM|PSM/i',
            '/CISSP|CISM|CEH|CompTIA/i',
        ];

        foreach ($certPatterns as $pattern) {
            if (preg_match_all($pattern, $content, $matches)) {
                foreach ($matches[0] as $cert) {
                    $certifications[] = trim($cert);
                }
            }
        }

        return array_unique($certifications);
    }

    /**
     * Extract year from text.
     */
    private function extractYear(string $text): ?int
    {
        if (preg_match('/\b(19|20)\d{2}\b/', $text, $matches)) {
            return (int) $matches[0];
        }
        return null;
    }

    /**
     * Get empty result structure.
     */
    private function getEmptyResult(): array
    {
        return [
            'success' => false,
            'data' => [
                'raw_text' => '',
                'contact' => [
                    'email' => null,
                    'phone' => null,
                    'linkedin' => null,
                    'github' => null,
                    'website' => null,
                    'address' => null,
                ],
                'skills' => [],
                'education' => [],
                'experience' => [],
                'summary' => null,
                'languages' => [],
                'certifications' => [],
            ],
        ];
    }

    /**
     * Analyze CV quality and completeness.
     */
    public function analyzeQuality(array $parsedData): array
    {
        $scores = [
            'contact' => 0,
            'skills' => 0,
            'education' => 0,
            'experience' => 0,
            'summary' => 0,
        ];

        $data = $parsedData['data'] ?? [];

        // Contact score
        $contact = $data['contact'] ?? [];
        if (!empty($contact['email'])) $scores['contact'] += 40;
        if (!empty($contact['phone'])) $scores['contact'] += 30;
        if (!empty($contact['linkedin'])) $scores['contact'] += 30;

        // Skills score
        $skillCount = count($data['skills'] ?? []);
        $scores['skills'] = min(100, $skillCount * 10);

        // Education score
        $educationCount = count($data['education'] ?? []);
        $scores['education'] = min(100, $educationCount * 50);

        // Experience score
        $experienceCount = count($data['experience'] ?? []);
        $scores['experience'] = min(100, $experienceCount * 25);

        // Summary score
        $summary = $data['summary'] ?? '';
        if (strlen($summary) > 100) {
            $scores['summary'] = min(100, strlen($summary) / 5);
        }

        $overallScore = (int) round(array_sum($scores) / count($scores));

        $suggestions = [];
        if ($scores['contact'] < 50) {
            $suggestions[] = 'Add more contact information (email, phone, LinkedIn)';
        }
        if ($scores['skills'] < 50) {
            $suggestions[] = 'List more relevant skills and technologies';
        }
        if ($scores['education'] < 50) {
            $suggestions[] = 'Include your educational background';
        }
        if ($scores['experience'] < 50) {
            $suggestions[] = 'Add more work experience details';
        }
        if ($scores['summary'] < 50) {
            $suggestions[] = 'Add a professional summary or objective';
        }

        return [
            'overall_score' => $overallScore,
            'section_scores' => $scores,
            'suggestions' => $suggestions,
            'is_complete' => $overallScore >= 70,
        ];
    }
}
