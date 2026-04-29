// Snoopy Phone Case Automation
// Gemini → Printify → Etsy
// Run with: node phone_case_automation.js

const NB_API_KEY = process.env.NB_API_KEY;
const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY;
const SHOP_ID = '18634010';
const BLUEPRINT_ID = 269;
const PRINT_PROVIDER_ID = 1;
const PRICE = 1999; // $19.99 in cents

// All variants with their print dimensions
const PHONE_VARIANTS = [
  { id: 112814, title: "iPhone 16",          w: 1246, h: 2085 },
  { id: 112815, title: "iPhone 16 Plus",     w: 1359, h: 2245 },
  { id: 112812, title: "iPhone 16 Pro",      w: 1246, h: 2085 },
  { id: 112813, title: "iPhone 16 Pro Max",  w: 1359, h: 2245 },
  { id: 103561, title: "iPhone 15",          w: 1201, h: 2080 },
  { id: 103562, title: "iPhone 15 Pro",      w: 1201, h: 2080 },
  { id: 103563, title: "iPhone 15 Plus",     w: 1320, h: 2250 },
  { id: 103564, title: "iPhone 15 Pro Max",  w: 1289, h: 2264 },
  { id: 93905,  title: "iPhone 14",          w: 1201, h: 2080 },
  { id: 93906,  title: "iPhone 14 Pro",      w: 1201, h: 2080 },
  { id: 93907,  title: "iPhone 14 Pro Max",  w: 1289, h: 2264 },
  { id: 93908,  title: "iPhone 14 Plus",     w: 1320, h: 2250 },
  { id: 76611,  title: "iPhone 13",          w: 1211, h: 2097 },
  { id: 76613,  title: "iPhone 13 Pro",      w: 1211, h: 2100 },
  { id: 76614,  title: "iPhone 13 Pro Max",  w: 1287, h: 2261 },
  { id: 105527, title: "Samsung Galaxy S24", w: 1192, h: 2069 },
  { id: 105528, title: "Samsung Galaxy S23", w: 1192, h: 2069 },
  { id: 125531, title: "Samsung Galaxy S25", w: 1251, h: 2097 },
  { id: 130115, title: "iPhone 17",          w: 1190, h: 2085 },
  { id: 130116, title: "iPhone 17 Pro",      w: 1201, h: 2080 },
  { id: 130117, title: "iPhone 17 Pro Max",  w: 1251, h: 2218 },
  { id: 130118, title: "iPhone 17 Air",      w: 1251, h: 2218 },
];

// Use the largest dimensions for image generation so it fits all sizes
const MAX_W = 1359;
const MAX_H = 2264;

const PROMPTS = [
  // CLASSIC SNOOPY POSES
  "Snoopy doing his iconic happy dance, arms raised, full body visible centered on bold yellow background",
  "Snoopy lying on top of his red doghouse, full body visible, starry night sky background",
  "Snoopy as the Flying Ace in pilot goggles and scarf, full body centered, sky background",
  "Snoopy hugging Woodstock tightly, both fully visible centered, soft pastel background",
  "Snoopy as Joe Cool with sunglasses, leaning casually, full body visible, retro background",
  "Snoopy sleeping peacefully on his doghouse roof, full body curled up, moon and stars background",
  "Snoopy standing proudly with his arms on his hips, full body centered, bold color background",
  "Snoopy doing a ballet dance pose, full body visible, pink and purple background",
  "Snoopy jumping for joy with confetti, full body airborne, colorful celebration background",
  "Snoopy sitting and smiling with Woodstock on his nose, full body visible, soft background",
  // SEASONAL SNOOPY
  "Snoopy in a Santa hat holding a gift, full body centered, Christmas red and green background",
  "Snoopy building a snowman, full body visible, snowy winter wonderland background",
  "Snoopy ice skating gracefully, full body in motion, frozen pond background",
  "Snoopy wrapped in a cozy scarf and hat, full body centered, falling snow background",
  "Snoopy holding a giant Halloween pumpkin, full body visible, orange and black background",
  "Snoopy in bunny ears at Easter, full body centered, spring flowers background",
  "Snoopy holding a sparkler on Fourth of July, full body visible, fireworks background",
  "Snoopy in a flower crown during spring, full body centered, pastel flower background",
  "Snoopy jumping in autumn leaves, full body airborne, orange fall foliage background",
  "Snoopy with a Valentine heart, full body visible, pink and red hearts background",
  // ACTIVITY SNOOPY
  "Snoopy surfing a wave at the beach, full body on surfboard, tropical ocean background",
  "Snoopy playing tennis with racket raised, full body in action pose, court background",
  "Snoopy skateboarding down a hill, full body on skateboard, urban colorful background",
  "Snoopy playing baseball with bat, full body in swing pose, stadium background",
  "Snoopy doing yoga in a lotus pose, full body centered, sunrise nature background",
  "Snoopy riding a bicycle, full body on bike, countryside road background",
  "Snoopy swimming in the ocean, full body visible above water, beach background",
  "Snoopy playing soccer, full body kicking ball, green field background",
  "Snoopy on a skateboard with helmet, full body doing a trick, skate park background",
  "Snoopy hiking with a backpack, full body centered, mountain landscape background",
  // ADVENTURE SNOOPY
  "Snoopy as an astronaut floating in space, full body in spacesuit, colorful galaxy background",
  "Snoopy as a superhero flying with cape, full body airborne, city skyline background",
  "Snoopy as a pirate with eye patch, full body centered, ocean ship background",
  "Snoopy as a cowboy with hat and boots, full body centered, western desert background",
  "Snoopy as a chef holding a giant cake, full body centered, kitchen background",
  "Snoopy as a rock star playing guitar, full body on stage, concert background",
  "Snoopy as a wizard with magic wand, full body centered, magical forest background",
  "Snoopy as a knight in armor, full body centered, castle background",
  "Snoopy as a race car driver, full body centered, race track background",
  "Snoopy as a firefighter with hose, full body centered, bold red background",
  // COZY SNOOPY
  "Snoopy reading a book in a cozy armchair, full body visible, warm library background",
  "Snoopy drinking hot cocoa by a fireplace, full body centered, cozy cabin background",
  "Snoopy napping in a hammock, full body visible, tropical palm tree background",
  "Snoopy sitting at a picnic blanket with Woodstock, full bodies visible, sunny meadow background",
  "Snoopy watching TV under a blanket, full body visible, cozy living room background",
  "Snoopy gardening with flowers, full body centered, colorful garden background",
  "Snoopy at a lemonade stand, full body centered, sunny summer background",
  "Snoopy cooking in an apron, full body centered, colorful kitchen background",
  "Snoopy painting on a canvas, full body centered, art studio background",
  "Snoopy fishing at a lake, full body seated visible, peaceful nature background",
  // MUSICAL SNOOPY
  "Snoopy playing piano, full body at piano centered, musical notes background",
  "Snoopy dancing to music with headphones, full body in dance pose, neon music background",
  "Snoopy playing drums, full body at drum kit, rock and roll background",
  "Snoopy singing into a microphone on stage, full body centered, spotlight background",
  "Snoopy playing a trumpet, full body centered, jazz club background",
  // FRIENDSHIP SNOOPY
  "Snoopy carrying Woodstock on his head, both fully visible centered, blue sky background",
  "Snoopy and Woodstock taking a selfie together, both centered, fun colorful background",
  "Snoopy and Woodstock under a rainbow, both fully visible, bright sky background",
  "Snoopy giving Woodstock a high five, both centered, celebration background",
  "Snoopy and Woodstock sitting on a cloud, both visible, dreamy sky background",
  // ART STYLE SNOOPY
  "Snoopy in bold pop art style with bright colors, full body centered, Andy Warhol inspired background",
  "Snoopy in retro vintage poster style, full body centered, aged paper texture background",
  "Snoopy in watercolor painting style, full body centered, soft pastel wash background",
  "Snoopy in neon glow style, full body centered, dark neon lit background",
  "Snoopy in geometric minimal style, full body centered, bold geometric shapes background",
  "Snoopy in kawaii cute style with big eyes, full body centered, pastel pink background",
  "Snoopy in graffiti street art style, full body centered, urban brick wall background",
  "Snoopy in stained glass art style, full body centered, colorful glass pattern background",
];

function pickPrompts() {
  var shuffled = PROMPTS.slice().sort(function() { return Math.random() - 0.5; });
  return shuffled.slice(0, 3);
}

async function retry(fn, retries, delay) {
  retries = retries || 3;
  delay = delay || 15000;
  for (var i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      console.error("Attempt " + (i + 1) + " failed: " + err.message);
      if (i < retries - 1) {
        console.log("Retrying in " + (delay / 1000) + "s...");
        await new Promise(function(r) { setTimeout(r, delay); });
      } else {
        throw err;
      }
    }
  }
}

async function generateImage(prompt) {
  console.log("Generating phone case image...");
  var sharp = require("sharp");
  var res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=" + NB_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt + " IMPORTANT: Snoopy must be fully visible from head to toe, centered in the middle of the image with significant padding on all sides so nothing is cropped. Leave at least 15% empty space on all four edges around Snoopy. Tall vertical portrait format. Bold colorful flat illustration style. No text, no words, no letters." }] }],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] }
      })
    }
  );
  var data = await res.json();
  var parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
  var imagePart = parts && parts.find(function(p) { return p.inlineData; });
  if (!imagePart) throw new Error("Image generation failed: " + JSON.stringify(data));

  // Resize to max phone case dimensions
  var inputBuffer = Buffer.from(imagePart.inlineData.data, "base64");
  var metadata = await sharp(inputBuffer).metadata();
  var width = metadata.width;
  var height = metadata.height;

  // Crop to correct ratio then resize to max dimensions
  var targetRatio = MAX_W / MAX_H;
  var currentRatio = width / height;
  var cropWidth, cropHeight, left, top;
  if (currentRatio > targetRatio) {
    cropHeight = height;
    cropWidth = Math.floor(height * targetRatio);
    left = Math.floor((width - cropWidth) / 2);
    top = 0;
  } else {
    cropWidth = width;
    cropHeight = Math.floor(width / targetRatio);
    left = 0;
    top = Math.floor((height - cropHeight) / 2);
  }

  var outputBuffer = await sharp(inputBuffer)
    .extract({ left: left, top: top, width: cropWidth, height: cropHeight })
    .resize(MAX_W, MAX_H)
    .png()
    .toBuffer();

  console.log("Image resized to " + MAX_W + "x" + MAX_H);
  return outputBuffer.toString("base64");
}

async function uploadToPrintify(base64Data) {
  console.log("Uploading image to Printify...");
  var res = await fetch("https://api.printify.com/v1/uploads/images.json", {
    method: "POST",
    headers: { "Authorization": "Bearer " + PRINTIFY_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ file_name: "phonecase_" + Date.now() + ".png", contents: base64Data })
  });
  var data = await res.json();
  if (!data.id) throw new Error("Upload failed: " + JSON.stringify(data));
  console.log("Uploaded, image ID:", data.id);
  return data.id;
}

async function createProduct(imageId, prompt) {
  console.log("Creating phone case product...");

  var variants = PHONE_VARIANTS.map(function(v) {
    return { id: v.id, is_enabled: true, price: PRICE };
  });

  var print_areas = PHONE_VARIANTS.map(function(v) {
    return {
      variant_ids: [v.id],
      placeholders: [{
        position: "front",
        images: [{ id: imageId, x: 0.5, y: 0.5, scale: 1, angle: 0, print_area_width: v.w, print_area_height: v.h }]
      }]
    };
  });

  var title = "Snoopy Woodstock Phone Case Peanuts Cute Phone Cover";
  var description = "Show off your love for Snoopy and the Peanuts gang with this adorable custom phone case! Featuring a unique hand-crafted illustration of everyone's favorite beagle, this tough phone case is perfect for any Peanuts fan.\n\nMade with a dual-layer protective design, this case keeps your phone safe while looking great. The vibrant full-wrap print covers the entire back and sides for maximum visual impact.\n\nAvailable for all major iPhone and Samsung Galaxy models. Makes a perfect gift for Snoopy lovers of all ages!";
  var tags = ["Snoopy phone case", "Peanuts case", "Snoopy gift", "cute phone case", "cartoon phone case", "Peanuts gift", "Snoopy lover", "beagle phone case", "kids phone case", "Snoopy cover", "Woodstock case", "Peanuts phone", "cute cartoon case"];

  var res = await fetch("https://api.printify.com/v1/shops/" + SHOP_ID + "/products.json", {
    method: "POST",
    headers: { "Authorization": "Bearer " + PRINTIFY_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      description: description,
      tags: tags,
      blueprint_id: BLUEPRINT_ID,
      print_provider_id: PRINT_PROVIDER_ID,
      variants: variants,
      print_areas: print_areas
    })
  });
  var data = await res.json();
  if (!data.id) throw new Error("Product creation failed: " + JSON.stringify(data));
  console.log("Product created, ID:", data.id);
  return data.id;
}

async function publishToEtsy(productId) {
  console.log("Waiting 45s for mockups...");
  await new Promise(function(r) { setTimeout(r, 45000); });
  console.log("Publishing to Etsy...");
  for (var attempt = 1; attempt <= 3; attempt++) {
    var res = await fetch(
      "https://api.printify.com/v1/shops/" + SHOP_ID + "/products/" + productId + "/publish.json",
      {
        method: "POST",
        headers: { "Authorization": "Bearer " + PRINTIFY_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ title: true, description: true, images: true, variants: true, tags: true, keyFeatures: true, shipping_template: true })
      }
    );
    var text = await res.text();
    console.log("Publish attempt " + attempt + " (status " + res.status + "):", text);
    if (res.status === 200 || res.status === 204) {
      // Check actual product status after publishing
      await new Promise(function(r) { setTimeout(r, 10000); });
      var checkRes = await fetch(
        "https://api.printify.com/v1/shops/" + SHOP_ID + "/products/" + productId + ".json",
        { headers: { "Authorization": "Bearer " + PRINTIFY_API_KEY } }
      );
      var product = await checkRes.json();
      console.log("Product status:", product.status);
      console.log("Publishing status:", product.publishing_status);
      console.log("Visible:", product.visible);
      break;
    }
    if (attempt < 3) await new Promise(function(r) { setTimeout(r, 20000); });
  }
}

async function run() {
  try { require("sharp"); } catch (e) {
    require("child_process").execSync("npm install sharp", { stdio: "inherit" });
  }

  var prompts = pickPrompts();
  console.log("Creating 3 phone case listings...");

  for (var i = 0; i < 3; i++) {
    var prompt = prompts[i];
    console.log("\n--- Phone Case " + (i + 1) + " of 3 ---");
    console.log("Prompt:", prompt);
    try {
      var base64Image = await retry(function() { return generateImage(prompt); });
      var imageId = await uploadToPrintify(base64Image);
      var productId = await createProduct(imageId, prompt);
      await publishToEtsy(productId);
      console.log("Phone case " + (i + 1) + " live on Etsy!");
      if (i < 2) await new Promise(function(r) { setTimeout(r, 10000); });
    } catch (err) {
      console.error("Phone case " + (i + 1) + " failed:", err.message);
    }
  }
  console.log("\nDone! All 3 phone cases processed.");
}

run();
