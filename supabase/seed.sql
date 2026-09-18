-- JOSAM AUTO — seed current stock (11 vehicles)
-- Run in Supabase Dashboard > SQL Editor AFTER schema.sql
-- Safe to re-run: new slugs insert, existing slugs update.

-- ── 1/11 Toyota Land Cruiser V8 ZX ──────────────────────
insert into vehicles (slug, make, model, trim, year, price_kes, mileage_km, fuel, transmission, drive, engine_cc, engine_summary, body_type, seats, exterior, interior, condition, status, location, origin, featured, is_new_arrival, images, description, features)
values ('toyota-land-cruiser-v8-zx-kdt', 'Toyota', 'Land Cruiser V8', 'ZX Bruno Edition', 2016, 7300000, 0, 'Petrol', 'Automatic', '4WD', 4600, '4.6L V8 Petrol', 'SUV', 7, 'Pearl White', 'Bruno Edition leather', 'Locally Used', 'available', 'Nairobi Showroom', 'Kenya', true, false,
ARRAY['/images/vehicles/toyota-land-cruiser-v8-zx-kdt/1.webp','/images/vehicles/toyota-land-cruiser-v8-zx-kdt/2.webp','/images/vehicles/toyota-land-cruiser-v8-zx-kdt/3.webp','/images/vehicles/toyota-land-cruiser-v8-zx-kdt/4.webp','/images/vehicles/toyota-land-cruiser-v8-zx-kdt/5.webp','/images/vehicles/toyota-land-cruiser-v8-zx-kdt/6.webp','/images/vehicles/toyota-land-cruiser-v8-zx-kdt/7.webp','/images/vehicles/toyota-land-cruiser-v8-zx-kdt/8.webp','/images/vehicles/toyota-land-cruiser-v8-zx-kdt/9.webp','/images/vehicles/toyota-land-cruiser-v8-zx-kdt/10.webp'],
'A supremely capable Land Cruiser V8 ZX in the coveted Bruno Edition, blending executive luxury with the legendary 4.6-litre V8''s effortless power. Low genuine mileage, tip-top condition inside and out, accident-free with ready documents. Purchase comes with a complimentary full tank of fuel and a complimentary service. Josam''s way of ensuring your ownership story starts perfectly.',
ARRAY['4.6L V8 Petrol: Powerful, Smooth & Refined','Bruno Edition leather interior','7 leather seats, spacious executive cabin','Front powered seats with memory function','Tesla-style radio infotainment','Working sunroof + cooler box','Height control suspension','Keyless entry & multi-functional steering wheel','Daytime running lights','Brand new tyres','Accident-free | Ready documents','FREE full tank + complimentary service on purchase'])
on conflict (slug) do update set
  price_kes = excluded.price_kes, mileage_km = excluded.mileage_km, status = excluded.status,
  featured = excluded.featured, is_new_arrival = excluded.is_new_arrival, images = excluded.images,
  description = excluded.description, features = excluded.features, updated_at = now();

-- ── 2/11 Porsche Cayenne Platinum ───────────────────────
insert into vehicles (slug, make, model, trim, year, price_kes, mileage_km, fuel, transmission, drive, engine_cc, engine_summary, body_type, seats, exterior, interior, condition, status, location, origin, featured, is_new_arrival, images, description, features)
values ('porsche-cayenne-platinum-edition-kdh', 'Porsche', 'Cayenne', 'Platinum Edition', 2015, 4950000, 0, 'Petrol', 'Automatic', 'AWD', 3600, '3.6L V6 Petrol', 'SUV', 5, 'White', 'Premium leather', 'Locally Used', 'available', 'Nairobi Showroom', 'Kenya', true, false,
ARRAY['/images/vehicles/porsche-cayenne-platinum-edition-kdh/1.webp','/images/vehicles/porsche-cayenne-platinum-edition-kdh/2.webp','/images/vehicles/porsche-cayenne-platinum-edition-kdh/3.webp','/images/vehicles/porsche-cayenne-platinum-edition-kdh/4.webp','/images/vehicles/porsche-cayenne-platinum-edition-kdh/5.webp','/images/vehicles/porsche-cayenne-platinum-edition-kdh/6.webp','/images/vehicles/porsche-cayenne-platinum-edition-kdh/7.webp','/images/vehicles/porsche-cayenne-platinum-edition-kdh/9.webp','/images/vehicles/porsche-cayenne-platinum-edition-kdh/10.webp','/images/vehicles/porsche-cayenne-platinum-edition-kdh/11.webp'],
'A well-preserved 2015 Porsche Cayenne Platinum Edition with low genuine mileage. Locally owned, carefully maintained and presented in tip-top condition. The smooth 3.6-litre V6 petrol drives through Porsche''s renowned automatic gearbox with effortless pace, while the Platinum Edition''s signature alloys and premium leather cabin set it apart from the standard car. Ready documents; just buy and drive.',
ARRAY['3.6L V6 Petrol engine, Automatic transmission','Multi-terrain drive selection','Premium leather upholstery','Working sunroof','Electric tailgate, hands-free access','Multi-functional steering wheel','Reverse camera with proximity sensors','Daytime running lights','Low genuine mileage | Well maintained','Tip-top condition, clean interior & exterior','Ready documents | Just buy & drive'])
on conflict (slug) do update set
  price_kes = excluded.price_kes, mileage_km = excluded.mileage_km, status = excluded.status,
  featured = excluded.featured, is_new_arrival = excluded.is_new_arrival, images = excluded.images,
  description = excluded.description, features = excluded.features, updated_at = now();

-- ── 3/11 Audi Q5 ────────────────────────────────────────
insert into vehicles (slug, make, model, trim, year, price_kes, mileage_km, fuel, transmission, drive, engine_cc, engine_summary, power_hp, torque_nm, accel_sec, body_type, seats, exterior, interior, condition, status, location, origin, featured, is_new_arrival, images, description, features)
values ('audi-q5-45-tfsi-quattro-2022', 'Audi', 'Q5', '45 TFSI quattro S line', 2022, 6850000, 38500, 'Petrol', 'Automatic', 'AWD', 2000, '2.0L TFSI Turbocharged I4', 261, 370, 6.1, 'SUV', 5, 'Glacier White', 'Black leather', 'Foreign Used', 'available', 'Nairobi Showroom', 'United Kingdom', true, false, '{}',
'A beautifully kept example of Audi''s benchmark mid-size luxury SUV. The 45 TFSI pairs a 2.0-litre turbocharged engine with the legendary quattro all-wheel-drive system and a seamless 7-speed S tronic gearbox, delivering 261 PS with effortless composure. Finished in Glacier White over black leather with the S line package, it arrives freshly imported, fully inspected and ready for its next custodian.',
ARRAY['S line exterior & interior package','quattro all-wheel drive','7-speed S tronic dual-clutch','Virtual Cockpit digital cluster','MMI Navigation plus with touch','Panoramic glass sunroof','Heated front sport seats','3-zone automatic climate control','Power tailgate with gesture control','LED matrix headlights','Rear-view camera & park sensors','Cruise control with speed limiter'])
on conflict (slug) do update set
  price_kes = excluded.price_kes, mileage_km = excluded.mileage_km, status = excluded.status,
  featured = excluded.featured, is_new_arrival = excluded.is_new_arrival, images = excluded.images,
  description = excluded.description, features = excluded.features, updated_at = now();

-- ── 4/11 Range Rover Sport ──────────────────────────────
insert into vehicles (slug, make, model, trim, year, price_kes, mileage_km, fuel, transmission, drive, engine_cc, engine_summary, power_hp, torque_nm, accel_sec, body_type, seats, exterior, interior, condition, status, location, origin, featured, is_new_arrival, images, description, features)
values ('range-rover-sport-hse-dynamic-2023', 'Land Rover', 'Range Rover Sport', 'HSE Dynamic D350', 2023, 22500000, 17400, 'Diesel', 'Automatic', 'AWD', 3000, '3.0L Ingenium I6 MHEV', 350, 700, 6.0, 'SUV', 5, 'Santorini Black', 'Ebony Windsor leather', 'Foreign Used', 'available', 'Nairobi Showroom', 'United Kingdom', true, false, '{}',
'The definitive statement in modern luxury SUVs. This Range Rover Sport HSE Dynamic pairs the silky D350 mild-hybrid straight-six with Terrain Response 2 and electronic air suspension, cosseting five occupants in Windsor leather while retaining genuine all-terrain authority. Supplied with a verified service history and full pre-delivery inspection.',
ARRAY['Electronic air suspension','Terrain Response 2','13.1-inch Pivi Pro touchscreen','Meridian Signature sound system','Windsor leather heated & cooled seats','Panoramic sliding roof','Soft-close doors','Pixel LED headlights','360-degree camera with wade sensing','Adaptive cruise with steering assist'])
on conflict (slug) do update set
  price_kes = excluded.price_kes, mileage_km = excluded.mileage_km, status = excluded.status,
  featured = excluded.featured, is_new_arrival = excluded.is_new_arrival, images = excluded.images,
  description = excluded.description, features = excluded.features, updated_at = now();

-- ── 5/11 Mercedes-Benz GLE ──────────────────────────────
insert into vehicles (slug, make, model, trim, year, price_kes, mileage_km, fuel, transmission, drive, engine_cc, engine_summary, power_hp, torque_nm, accel_sec, body_type, seats, exterior, interior, condition, status, location, origin, featured, is_new_arrival, images, description, features)
values ('mercedes-benz-gle-450-amg-line-2022', 'Mercedes-Benz', 'GLE', '450 4MATIC AMG Line', 2022, 14900000, 24800, 'Petrol', 'Automatic', 'AWD', 3000, '3.0L Turbo I6 + EQ Boost', 367, 500, 5.7, 'SUV', 5, 'Obsidian Black', 'Macchiato beige leather', 'Foreign Used', 'available', 'Nairobi Showroom', 'Japan', false, true, '{}',
'Effortless pace meets S-Class-inspired refinement. The GLE 450''s inline-six with EQ Boost delivers seamless thrust through the 9G-Tronic, while the AMG Line cabin wraps its occupants in double-stitched leather, Burmester sound and the twin 12.3-inch MBUX widescreen. A Japan-sourced grade-4.5 unit with full documentation.',
ARRAY['AMG Line exterior & interior','AIRMATIC air suspension','MBUX dual 12.3-inch displays','Burmester surround sound','Panoramic sliding sunroof','Heated & ventilated front seats','360-degree camera with active park assist','Ambient lighting, 64 colours','Active Distance Assist DISTRONIC'])
on conflict (slug) do update set
  price_kes = excluded.price_kes, mileage_km = excluded.mileage_km, status = excluded.status,
  featured = excluded.featured, is_new_arrival = excluded.is_new_arrival, images = excluded.images,
  description = excluded.description, features = excluded.features, updated_at = now();

-- ── 6/11 Toyota Land Cruiser 300 ────────────────────────
insert into vehicles (slug, make, model, trim, year, price_kes, mileage_km, fuel, transmission, drive, engine_cc, engine_summary, power_hp, torque_nm, accel_sec, body_type, seats, exterior, interior, condition, status, location, origin, featured, is_new_arrival, images, description, features)
values ('toyota-land-cruiser-300-zx-2022', 'Toyota', 'Land Cruiser 300', 'ZX', 2022, 19800000, 29200, 'Diesel', 'Automatic', '4WD', 3300, '3.3L Twin-Turbo Diesel V6', 305, 700, 7.4, 'SUV', 7, 'Precious White Pearl', 'Black semi-aniline leather', 'Foreign Used', 'available', 'Nairobi Showroom', 'Japan', true, false, '{}',
'The king of African roads in its most refined generation. The ZX flagship pairs the 3.3-litre twin-turbo diesel V6 with a 10-speed automatic and full-time 4WD with three locks, seating seven in semi-aniline leather. Full import documentation available on request.',
ARRAY['3.3L twin-turbo diesel, 700 Nm','10-speed automatic, full-time 4WD','Multi-Terrain Select & Crawl Control','Toyota Safety Sense suite','12.3-inch infotainment with JBL audio','Heated & ventilated seats, first & second row','Power tailgate with kick sensor','7-seat configuration','Around-view monitor'])
on conflict (slug) do update set
  price_kes = excluded.price_kes, mileage_km = excluded.mileage_km, status = excluded.status,
  featured = excluded.featured, is_new_arrival = excluded.is_new_arrival, images = excluded.images,
  description = excluded.description, features = excluded.features, updated_at = now();

-- ── 7/11 Porsche Cayenne S ──────────────────────────────
insert into vehicles (slug, make, model, trim, year, price_kes, mileage_km, fuel, transmission, drive, engine_cc, engine_summary, power_hp, torque_nm, accel_sec, body_type, seats, exterior, interior, condition, status, location, origin, featured, is_new_arrival, images, description, features)
values ('porsche-cayenne-s-2021', 'Porsche', 'Cayenne', 'S', 2021, 16500000, 31000, 'Petrol', 'Automatic', 'AWD', 2900, '2.9L Twin-Turbo V6', 440, 550, 5.0, 'SUV', 5, 'Moonlight Blue', 'Black leather', 'Foreign Used', 'reserved', 'Nairobi Showroom', 'United Kingdom', false, true, '{}',
'The sports car of the SUV world. A 440 PS twin-turbo V6, adaptive air suspension and Porsche Active Suspension Management give the Cayenne S poise no rival matches, wrapped in a discreet yet unmistakable silhouette. Porsche Approved history, fully inspected on arrival.',
ARRAY['Adaptive air suspension with PASM','Sport Chrono package','BOSE surround sound','Porsche Communication Management','Panoramic roof system','Heated 18-way adaptive sport seats','Lane change & lane keep assist','Power steering plus'])
on conflict (slug) do update set
  price_kes = excluded.price_kes, mileage_km = excluded.mileage_km, status = excluded.status,
  featured = excluded.featured, is_new_arrival = excluded.is_new_arrival, images = excluded.images,
  description = excluded.description, features = excluded.features, updated_at = now();

-- ── 8/11 Lexus LX 600 ───────────────────────────────────
insert into vehicles (slug, make, model, trim, year, price_kes, mileage_km, fuel, transmission, drive, engine_cc, engine_summary, power_hp, torque_nm, accel_sec, body_type, seats, exterior, interior, condition, status, location, origin, featured, is_new_arrival, images, description, features)
values ('lexus-lx-600-executive-2023', 'Lexus', 'LX 600', 'Executive', 2023, 24500000, 12600, 'Petrol', 'Automatic', '4WD', 3400, '3.4L Twin-Turbo V6', 409, 650, 6.9, 'SUV', 4, 'Graphite Black', 'Sunflare semi-aniline leather', 'Foreign Used', 'available', 'Nairobi Showroom', 'Japan', false, true, '{}',
'The four-seat Executive is Lexus at its most indulgent: reclining rear captain''s chairs with ottoman, a Mark Levinson reference system and the effortless 409 PS twin-turbo V6. Rarely available locally; this is a flagship in the truest sense.',
ARRAY['Executive 4-seat layout with ottomans','Mark Levinson 25-speaker audio','Rear-seat entertainment, dual 11.4-inch','Active height control & adaptive suspension','Lexus Safety System+ 2.5','Semi-aniline leather, massage seats','Cool box & refrigerated console','Power running boards'])
on conflict (slug) do update set
  price_kes = excluded.price_kes, mileage_km = excluded.mileage_km, status = excluded.status,
  featured = excluded.featured, is_new_arrival = excluded.is_new_arrival, images = excluded.images,
  description = excluded.description, features = excluded.features, updated_at = now();

-- ── 9/11 BMW X5 ─────────────────────────────────────────
insert into vehicles (slug, make, model, trim, year, price_kes, mileage_km, fuel, transmission, drive, engine_cc, engine_summary, power_hp, torque_nm, accel_sec, body_type, seats, exterior, interior, condition, status, location, origin, featured, is_new_arrival, images, description, features)
values ('bmw-x5-xdrive40i-2023', 'BMW', 'X5', 'xDrive40i M Sport', 2023, 15800000, 21300, 'Petrol', 'Automatic', 'AWD', 3000, '3.0L TwinPower Turbo I6', 381, 520, 5.5, 'SUV', 5, 'Mineral White', 'Cognac Sensafin', 'Foreign Used', 'available', 'Nairobi Showroom', 'United Kingdom', false, true, '{}',
'The benchmark sporting luxury SUV. BMW''s creamy B58 inline-six, adaptive M suspension and the sweeping Curved Display make this X5 as compelling on a highway sweep as it is in the school run. M Sport package, Harman Kardon audio and verified UK provenance.',
ARRAY['M Sport package','BMW Curved Display, iDrive 8','Adaptive M suspension','Harman Kardon surround sound','Panoramic glass roof','Comfort Access & soft-close doors','Parking Assistant Plus','Heated front & rear seats','M Sport brakes'])
on conflict (slug) do update set
  price_kes = excluded.price_kes, mileage_km = excluded.mileage_km, status = excluded.status,
  featured = excluded.featured, is_new_arrival = excluded.is_new_arrival, images = excluded.images,
  description = excluded.description, features = excluded.features, updated_at = now();

-- ── 10/11 Range Rover Autobiography ─────────────────────
insert into vehicles (slug, make, model, trim, year, price_kes, mileage_km, fuel, transmission, drive, engine_cc, engine_summary, power_hp, torque_nm, accel_sec, body_type, seats, exterior, interior, condition, status, location, origin, featured, is_new_arrival, images, description, features)
values ('range-rover-vogue-autobiography-2022', 'Land Rover', 'Range Rover', 'Autobiography P530 LWB', 2022, 32000000, 9800, 'Petrol', 'Automatic', 'AWD', 4400, '4.4L Twin-Turbo V8', 530, 750, 4.6, 'SUV', 5, 'Borasco Grey', 'Caraway Windsor leather', 'Foreign Used', 'in-transit', 'En route, Mombasa, ETA 4 weeks', 'United Kingdom', true, false, '{}',
'The fifth-generation Range Rover in long-wheelbase Autobiography form. The definitive luxury SUV, full stop. A 530 PS twin-turbo V8, rear-axle steering, executive-class rear seating and near-silent running. Currently in transit; secure it ahead of arrival with a refundable reservation.',
ARRAY['4.4L twin-turbo V8, 530 PS','Long wheelbase executive seating','Rear-axle steering','Meridian Signature Reference audio','24-way heated/cooled massage seats','Sliding panoramic roof','Electronic air suspension with eHorizon','Soft-close doors & powered tailgate','ClearSight interior rear-view mirror'])
on conflict (slug) do update set
  price_kes = excluded.price_kes, mileage_km = excluded.mileage_km, status = excluded.status,
  featured = excluded.featured, is_new_arrival = excluded.is_new_arrival, images = excluded.images,
  description = excluded.description, features = excluded.features, updated_at = now();

-- ── 11/11 Toyota Hilux ──────────────────────────────────
insert into vehicles (slug, make, model, trim, year, price_kes, mileage_km, fuel, transmission, drive, engine_cc, engine_summary, body_type, seats, exterior, interior, condition, status, location, origin, featured, is_new_arrival, images, description, features)
values ('toyota-hilux-double-cabin-2021', 'Toyota', 'Hilux', 'Double Cabin', 2021, 5750000, 0, 'Diesel', 'Automatic', '4WD', 2400, '2.4L Diesel', 'Pickup', 5, 'White', 'Fabric/leather', 'Foreign Used', 'available', 'Nairobi Showroom', 'Japan', false, true,
ARRAY['/images/vehicles/toyota-hilux-double-cabin-2021/1.webp','/images/vehicles/toyota-hilux-double-cabin-2021/2.webp','/images/vehicles/toyota-hilux-double-cabin-2021/3.webp','/images/vehicles/toyota-hilux-double-cabin-2021/4.webp','/images/vehicles/toyota-hilux-double-cabin-2021/5.webp','/images/vehicles/toyota-hilux-double-cabin-2021/6.webp','/images/vehicles/toyota-hilux-double-cabin-2021/7.webp','/images/vehicles/toyota-hilux-double-cabin-2021/8.webp','/images/vehicles/toyota-hilux-double-cabin-2021/9.webp','/images/vehicles/toyota-hilux-double-cabin-2021/10.webp'],
'A 2021 Toyota Hilux Double Cabin in tip-top condition with low genuine mileage, well maintained and lightly driven. The proven 2.4-litre diesel engine pairs with a smooth automatic gearbox and switchable 4WD, making this an effortlessly capable everyday workhorse and weekend adventurer alike. Ready documents; just buy and drive.',
ARRAY['2.4L Diesel engine, efficient & proven','Automatic transmission','4WD optional, on & off road capability','Multi-functional steering wheel','Keyless entry','Lane departure warning','Blind spot monitoring','Low genuine mileage','Tip-top condition, clean interior & exterior','Ready documents | Just buy & drive'])
on conflict (slug) do update set
  price_kes = excluded.price_kes, mileage_km = excluded.mileage_km, status = excluded.status,
  featured = excluded.featured, is_new_arrival = excluded.is_new_arrival, images = excluded.images,
  description = excluded.description, features = excluded.features, updated_at = now();

-- ── Link brands ─────────────────────────────────────────
update vehicles set brand_id = brands.id from brands where vehicles.make = brands.name;
