import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faHand,
  faLanguage,
  faHashtag,
  faFont,
  faGraduationCap
} from "@fortawesome/free-solid-svg-icons";
import { 
  BDSL_VOWELS, 
  BDSL_CONSONANTS, 
  BDSL_DIGITS,
  getBDSLGestures,
  getBDSLDigits
} from "@/utils/bdslGestureLogic";

export default function BanglaSignGuide() {
  const vowels = BDSL_VOWELS.map((v, i) => ({
    ...v,
    imagePath: `/bdsl/dataset/characters/${v.id}.JPG`
  }));
  
  const consonants = BDSL_CONSONANTS.map((c, i) => ({
    ...c,
    imagePath: `/bdsl/dataset/characters/${c.id}.JPG`
  }));
  
  const digits = BDSL_DIGITS.map((d, i) => ({
    ...d,
    imagePath: `/bdsl/dataset/digits/${d.id}.JPG`
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-home">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/translate">
            <Button data-testid="button-start-translating">
              Start Translating
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            <FontAwesomeIcon icon={faLanguage} className="mr-2" />
            বাংলা ইশারা ভাষা শিক্ষা
          </Badge>
          
          <h1 className="text-4xl font-bold mb-4">
            বাংলা ইশারা ভাষা শিখুন
          </h1>
          <h2 className="text-2xl text-muted-foreground mb-2">
            Learn Bangla Sign Language (BDSL)
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Master the 36 Bengali alphabet characters and 10 digits using the CDD Standard 
            hand gestures. Each sign is designed for clear recognition.
          </p>
        </div>

        <Card className="mb-8 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 text-white rounded-full">
                <FontAwesomeIcon icon={faGraduationCap} className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-lg mb-2">
                  CDD Standard - বাংলাদেশ ইশারা ভাষা মান
                </h3>
                <p className="text-blue-600 dark:text-blue-400">
                  This guide follows the <strong>Centre for Disability in Development (CDD)</strong> standard 
                  used across Bangladesh. The gestures are one-handed static signs that can be 
                  recognized in real-time by our AI system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="vowels" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="vowels" className="flex items-center gap-2" data-testid="tab-vowels">
              <FontAwesomeIcon icon={faFont} />
              স্বরবর্ণ (Vowels)
            </TabsTrigger>
            <TabsTrigger value="consonants" className="flex items-center gap-2" data-testid="tab-consonants">
              <FontAwesomeIcon icon={faHand} />
              ব্যঞ্জনবর্ণ (Consonants)
            </TabsTrigger>
            <TabsTrigger value="digits" className="flex items-center gap-2" data-testid="tab-digits">
              <FontAwesomeIcon icon={faHashtag} />
              সংখ্যা (Digits)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vowels">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">স্বরবর্ণ - Vowels ({vowels.length} signs)</h3>
              <p className="text-muted-foreground">
                The 6 basic vowel sounds in Bengali sign language.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {vowels.map((vowel, index) => (
                <Card key={vowel.id} className="overflow-hidden hover-elevate" data-testid={`card-vowel-${vowel.id}`}>
                  <div className="aspect-square bg-muted relative">
                    <img 
                      src={vowel.imagePath} 
                      alt={`${vowel.character} - ${vowel.name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <Badge className="absolute top-2 left-2 bg-blue-500">
                      {index + 1}
                    </Badge>
                  </div>
                  <CardContent className="p-3 text-center">
                    <div className="text-3xl font-bold mb-1">{vowel.character}</div>
                    <div className="text-sm text-muted-foreground">{vowel.name}</div>
                    <div className="text-xs text-muted-foreground/70">/{vowel.romanized}/</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="consonants">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">ব্যঞ্জনবর্ণ - Consonants ({consonants.length} signs)</h3>
              <p className="text-muted-foreground">
                The 30 consonant sounds in Bengali sign language.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {consonants.map((consonant, index) => (
                <Card key={consonant.id} className="overflow-hidden hover-elevate" data-testid={`card-consonant-${consonant.id}`}>
                  <div className="aspect-square bg-muted relative">
                    <img 
                      src={consonant.imagePath} 
                      alt={`${consonant.character} - ${consonant.name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <Badge className="absolute top-2 left-2 bg-green-500">
                      {index + 1}
                    </Badge>
                  </div>
                  <CardContent className="p-3 text-center">
                    <div className="text-3xl font-bold mb-1">{consonant.character}</div>
                    <div className="text-sm text-muted-foreground">{consonant.name}</div>
                    <div className="text-xs text-muted-foreground/70">/{consonant.romanized}/</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="digits">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">সংখ্যা - Digits ({digits.length} signs)</h3>
              <p className="text-muted-foreground">
                The 10 Bengali numerals (0-9) in sign language.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4">
              {digits.map((digit, index) => (
                <Card key={digit.id} className="overflow-hidden hover-elevate" data-testid={`card-digit-${digit.id}`}>
                  <div className="aspect-square bg-muted relative">
                    <img 
                      src={digit.imagePath} 
                      alt={`${digit.character} - ${digit.name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <Badge className="absolute top-2 left-2 bg-purple-500">
                      {digit.romanized}
                    </Badge>
                  </div>
                  <CardContent className="p-3 text-center">
                    <div className="text-3xl font-bold mb-1">{digit.character}</div>
                    <div className="text-sm text-muted-foreground">{digit.name}</div>
                    <div className="text-xs text-muted-foreground/70">{digit.romanized}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Card className="inline-block">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Ready to Practice?</h3>
              <p className="text-muted-foreground mb-4">
                Use our real-time translator to practice Bangla Sign Language with AI-powered recognition.
              </p>
              <Link href="/translate">
                <Button size="lg" data-testid="button-practice-now">
                  <FontAwesomeIcon icon={faHand} className="mr-2" />
                  Start Practicing Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Dataset: <a href="https://github.com/Sanzidikawsar/Bangla-Sign-Language" className="underline" target="_blank" rel="noopener">
              Bangla Sign Language (BdSL) by Sanzidi Kawsar
            </a>
          </p>
          <p className="mt-1">
            Standard: Centre for Disability in Development (CDD) Bangladesh
          </p>
        </div>
      </main>
    </div>
  );
}
