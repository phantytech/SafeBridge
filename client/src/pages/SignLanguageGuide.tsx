import { Link } from "wouter";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHand, faArrowLeft, faTriangleExclamation, faHeart, faComment, faCircleQuestion,
  faThumbsUp, faThumbsDown, faPhone, faBed, faUtensils, faWineGlass, faFaceSmile, 
  faFaceFrown, faCircleCheck, faCircleXmark, faCirclePause, faPlay, 
  faArrowRightToBracket, faArrowRightFromBracket, faEye, faVolumeHigh
} from '@fortawesome/free-solid-svg-icons';
import { getAllGestures, gestureDescriptions, DetectedGesture } from "../utils/gestureLogic";

interface GestureCardProps {
  gesture: Exclude<DetectedGesture, null>;
  description: string;
  instructions: string;
  category: string;
  isEmergency?: boolean;
}

const gestureInstructions: Record<Exclude<DetectedGesture, null>, string> = {
  "HELLO": "Extend all five fingers and wave your open palm",
  "YES": "Make a fist and extend only your thumb upward",
  "SOS": "Close all fingers into a tight fist - this triggers emergency alert",
  "PEACE": "Extend your index and middle fingers in a V shape, keep other fingers folded",
  "NO": "Extend only your index finger pointing upward, keep other fingers folded",
  "THANK YOU": "Open palm with all fingers extended, thumb spread away from palm",
  "PLEASE": "Flat hand with four fingers extended, thumb folded against palm",
  "SORRY": "Make a fist and place thumb across the folded fingers",
  "HELP": "Extend your thumb and index finger, keep other fingers folded",
  "LOVE": "Extend thumb, index finger, and pinky - the 'I Love You' sign",
  "GOOD": "Thumbs up gesture with thumb pointing upward",
  "BAD": "Thumbs down gesture with thumb pointing downward",
  "STOP": "Open palm with all fingers extended and held close together",
  "OK": "Touch your thumb and index finger to form a circle, extend other fingers",
  "CALL": "Extend thumb and pinky only, simulating a phone shape",
  "WAIT": "Open palm facing down with all fingers level and extended",
  "COME": "Extend index finger and curl it in a beckoning motion",
  "GO": "Point with index finger extended forward, thumb also extended",
  "EAT": "Bring fingertips together and touch them to your thumb",
  "DRINK": "Extend thumb and pinky, bring thumb toward your face",
  "SLEEP": "Extend four fingers with palm tilted, simulating resting on pillow",
  "HAPPY": "Open palm with all fingers spread wide apart",
  "SAD": "Extend only index finger pointing downward"
};

const gestureCategories: Record<Exclude<DetectedGesture, null>, string> = {
  "HELLO": "Greetings",
  "YES": "Responses",
  "SOS": "Emergency",
  "PEACE": "Expressions",
  "NO": "Responses",
  "THANK YOU": "Courtesy",
  "PLEASE": "Courtesy",
  "SORRY": "Courtesy",
  "HELP": "Emergency",
  "LOVE": "Emotions",
  "GOOD": "Responses",
  "BAD": "Responses",
  "STOP": "Commands",
  "OK": "Responses",
  "CALL": "Actions",
  "WAIT": "Commands",
  "COME": "Commands",
  "GO": "Commands",
  "EAT": "Daily Activities",
  "DRINK": "Daily Activities",
  "SLEEP": "Daily Activities",
  "HAPPY": "Emotions",
  "SAD": "Emotions"
};

const gestureIcons: Record<Exclude<DetectedGesture, null>, any> = {
  "HELLO": faHand,
  "YES": faThumbsUp,
  "SOS": faTriangleExclamation,
  "PEACE": faHand,
  "NO": faCircleXmark,
  "THANK YOU": faHeart,
  "PLEASE": faHand,
  "SORRY": faHand,
  "HELP": faCircleQuestion,
  "LOVE": faHeart,
  "GOOD": faThumbsUp,
  "BAD": faThumbsDown,
  "STOP": faCirclePause,
  "OK": faCircleCheck,
  "CALL": faPhone,
  "WAIT": faEye,
  "COME": faArrowRightToBracket,
  "GO": faArrowRightFromBracket,
  "EAT": faUtensils,
  "DRINK": faWineGlass,
  "SLEEP": faBed,
  "HAPPY": faFaceSmile,
  "SAD": faFaceFrown
};

const categoryIcons: Record<string, any> = {
  "Greetings": faHand,
  "Responses": faComment,
  "Emergency": faTriangleExclamation,
  "Expressions": faHeart,
  "Courtesy": faHeart,
  "Emotions": faHeart,
  "Commands": faHand,
  "Actions": faHand,
  "Daily Activities": faUtensils
};

const categoryColors: Record<string, string> = {
  "Greetings": "bg-blue-100 text-blue-600 border-blue-200",
  "Responses": "bg-green-100 text-green-600 border-green-200",
  "Emergency": "bg-red-100 text-red-600 border-red-200",
  "Expressions": "bg-purple-100 text-purple-600 border-purple-200",
  "Courtesy": "bg-pink-100 text-pink-600 border-pink-200",
  "Emotions": "bg-yellow-100 text-yellow-600 border-yellow-200",
  "Commands": "bg-orange-100 text-orange-600 border-orange-200",
  "Actions": "bg-indigo-100 text-indigo-600 border-indigo-200",
  "Daily Activities": "bg-teal-100 text-teal-600 border-teal-200"
};

const GestureCard = ({ gesture, description, instructions, category, isEmergency }: GestureCardProps) => {
  const colorClass = categoryColors[category] || "bg-gray-100 text-gray-600 border-gray-200";
  const gestureIcon = gestureIcons[gesture] || faHand;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white rounded-2xl p-6 shadow-sm border ${isEmergency ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass.split(' ')[0]} ${isEmergency ? 'bg-red-100' : ''}`}>
            <FontAwesomeIcon 
              icon={gestureIcon} 
              className={`${isEmergency ? 'text-red-600' : colorClass.split(' ')[1]}`}
              style={{ fontSize: '1.25rem' }}
            />
          </div>
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colorClass} mb-2`}>
              {category}
            </span>
            <h3 className={`text-xl font-bold ${isEmergency ? 'text-red-600' : 'text-slate-800'}`}>
              {gesture}
            </h3>
          </div>
        </div>
        {isEmergency && (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-600" style={{ fontSize: '1.25rem' }} />
          </div>
        )}
      </div>
      
      <p className="text-slate-600 text-sm mb-3">{description}</p>
      
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <FontAwesomeIcon icon={faHand} className="text-slate-400" style={{ fontSize: '1.5rem' }} />
            <span className="text-xs text-slate-400">How</span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed pt-1">{instructions}</p>
        </div>
      </div>
    </motion.div>
  );
};

const SignLanguageGuide = () => {
  const allGestures = getAllGestures();
  
  const groupedGestures = allGestures.reduce((acc, gesture) => {
    const category = gestureCategories[gesture];
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(gesture);
    return acc;
  }, {} as Record<string, Exclude<DetectedGesture, null>[]>);

  const categoryOrder = ["Emergency", "Greetings", "Responses", "Courtesy", "Emotions", "Commands", "Actions", "Daily Activities", "Expressions"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors" data-testid="link-back-home">
              <FontAwesomeIcon icon={faArrowLeft} />
              <span className="font-medium">Back to Home</span>
            </Link>
            <Link href="/dashboard" className="bg-primary text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-blue-600 transition-colors" data-testid="link-start-translating">
              Start Translating
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FontAwesomeIcon icon={faHand} />
            <span>Sign Language Reference Guide</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Learn Sign Language
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Master {allGestures.length} essential signs for communication. 
            Each gesture is designed for quick recognition by our AI system.
          </p>
        </motion.div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-600" style={{ fontSize: '1.5rem' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-800 mb-2">Emergency SOS Feature</h2>
              <p className="text-red-700 text-sm leading-relaxed">
                The <strong>SOS gesture (closed fist)</strong> is a special emergency signal. 
                When held for 3 seconds, it will automatically trigger an emergency alert 
                to contact emergency services (999). Use this gesture only in genuine emergencies.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {categoryOrder.map(category => {
            const gestures = groupedGestures[category];
            if (!gestures) return null;
            
            const IconComponent = categoryIcons[category] || faHand;
            
            return (
              <section key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${categoryColors[category]?.split(' ')[0] || 'bg-gray-100'}`}>
                    <FontAwesomeIcon 
                      icon={IconComponent} 
                      className={categoryColors[category]?.split(' ')[1] || 'text-gray-600'}
                      style={{ fontSize: '1.25rem' }}
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{category}</h2>
                  <span className="text-slate-400 text-sm">({gestures.length} signs)</span>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gestures.map(gesture => (
                    <GestureCard
                      key={gesture}
                      gesture={gesture}
                      description={gestureDescriptions[gesture]}
                      instructions={gestureInstructions[gesture]}
                      category={category}
                      isEmergency={gesture === "SOS" || gesture === "HELP"}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Practice?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Start using these signs with our real-time AI detection system. 
            Practice each gesture and see instant recognition results.
          </p>
          <Link href="/dashboard" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors" data-testid="button-launch-app">
            Launch App
          </Link>
        </motion.div>
      </main>

      <footer className="border-t border-slate-100 mt-16 py-8">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          SafeBridge Bangladesh - Bridging the gap for everyone
        </div>
      </footer>
    </div>
  );
};

export default SignLanguageGuide;
