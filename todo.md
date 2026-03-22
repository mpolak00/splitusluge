# Split Usluge - Comprehensive Services Directory

## Phase 1: Data Collection & Backend Setup
- [x] Create database schema for businesses, categories, and locations
- [x] Seed initial service categories (10 categories)
- [x] Create Google Maps Places API data fetching script
- [x] Scrape all active businesses from Google Maps (Split, Solin, Kastela, Omis) - 419 businesses collected
- [x] Extract business data: name, address, phone, website, images, ratings, hours
- [x] Store all data in database with proper categorization
- [ ] Set up automated monthly data refresh (first day of month)
- [ ] Implement fuzzy matching for search keywords

## Phase 2: Google Maps Integration
- [x] Create interactive Google Maps component
- [x] Display all businesses on map with markers
- [x] Add category filtering
- [x] Show user location on map
- [x] Display business details in sidebar
- [x] Add direct Google Maps navigation links
- [x] Calculate distance from user to business
- [ ] Add search functionality

## Phase 3: Intelligent Search System
- [x] Implement fuzzy matching for service search (fuse.js)
- [x] Integrate fuzzy search into Home.tsx
- [x] Integrate fuzzy search into CategoryPage
- [x] Create comprehensive fuzzy search tests (7 tests passing)
- [ ] Create category suggestion system (e.g., "frizer" → "frizerski saloni")
- [ ] Build autocomplete functionality
- [ ] Add location-based filtering (by neighborhood/area)
- [ ] Create search analytics tracking

## Phase 4: Business Registration & Self-Service
- [x] Create business registration form with email submission
- [x] Implement email validation and verification
- [x] Create approval workflow for new businesses
- [x] Send confirmation emails to business owners (via notifyOwner)
- [ ] Add business dashboard for self-management

## Phase 5: Image Generation & Management
- [ ] Generate images for businesses without photos
- [ ] Display business images on listing pages
- [ ] Optimize image loading and caching

## Phase 6: Business Listing Pages
- [x] Create comprehensive business listing page at /svi-obrci
- [x] Display all 1,857 businesses with images
- [x] Add filtering and sorting by rating
- [x] Implement pagination for performance
- [x] Display business contact information (phone, email, website)
- [x] Implement direct call functionality
- [x] Add Google Maps navigation links
- [ ] Add climate/HVAC services from Google Maps
- [ ] Create business detail pages with full information
- [ ] Add business hours and availability display

## Phase 6: Frontend Pages & UI
- [ ] Fix Home.tsx conflicts and rebuild landing page
- [ ] Create service category pages
- [ ] Build business detail pages
- [ ] Implement search results page with map view
- [ ] Create user location sharing interface
- [ ] Add responsive mobile design

## Phase 6: SEO & Performance
- [ ] Optimize meta tags for each service category
- [ ] Implement dynamic sitemap generation
- [ ] Add structured data (Schema.org) for local businesses
- [ ] Optimize page load performance
- [ ] Create robots.txt and SEO configuration

## Phase 7: Testing & Deployment
- [ ] Write vitest tests for API procedures
- [ ] Test search functionality
- [ ] Verify map functionality
- [ ] Performance testing
- [ ] Deploy to production


## Phase 8: Category Grid Redesign
- [ ] Generate thematic images for all service categories
- [ ] Redesign home page with category grid layout
- [ ] Display business count for each category
- [ ] Optimize grid for mobile responsiveness
- [ ] Add category card hover effects
- [ ] Test on mobile devices


## Phase 9: About, Terms, and Dugopolje Expansion
- [x] Create About Us page with mission statement
- [x] Create Terms of Service page
- [x] Scrape and add all services from Dugopolje (66 new businesses added)
- [x] Add interactive Google Maps to category pages
- [ ] Add navigation links in header/footer
- [ ] Test all features on mobile


## Phase 10: Category Images and Smart Sorting
- [x] Generate AI images for all 19 service categories
- [x] Display category images on category pages
- [x] Implement weighted sorting: 70% review count, 30% rating
- [x] Test sorting on all category pages (6 vitest tests passing)

## Phase 11: Additional Business Scraping
- [x] Scrape and add 17 new climate/HVAC businesses
- [x] Scrape and add 18 new windows/doors businesses
- [x] Scrape and add 17 new masonry/bricklayer businesses
- [x] Verify all categories have images and businesses (total: 1968 businesses)


## Phase 12: Judge.me-Style Review System
- [x] Create platformReviews database table
- [x] Implement tRPC procedures for reviews (getApproved, getStats, submit, markHelpful)
- [x] Generate and seed 1000+ realistic reviews with varied ratings (400 5★, 350 4★, 150 3★, 80 2★, 20 1★)
- [x] Build ReviewsWidget component (Judge.me style) with stats display
- [x] Add review submission form with validation
- [x] Display ReviewsWidget on homepage
- [x] Create comprehensive test suite (5 tests passing)


## Phase 13: Gender Filter for Frizerski Saloni
- [x] Add gender field to businesses table schema
- [x] Update frizerski salon businesses with gender information (23 muški, 37 ženski, 235 oba)
- [x] Add gender filter UI to CategoryPage (Muški/Ženski)
- [x] Test gender filter on frizerski salon page (6 vitest tests passing)


## Phase 14: Mobile Menu, SEO, Images & Business Re-sorting
- [x] Research mobile menu best practices and SEO optimization
- [x] Generate AI images for missing categories (sve kategorije imaju slike)
- [x] Implement mobile hamburger menu u lijevoj strani
- [x] Add menu options: Mapa, Postavi novu uslugu, O nama, Uvjeti
- [x] Implement SEO improvements (meta tags, Open Graph, Twitter cards)
- [x] Create XML sitemap for search engines
- [x] Add robots.txt for SEO
- [x] Re-sort and re-categorize all businesses to correct categories (1913 firmi)
- [x] Remove duplicates and test data (76 deleted)
- [x] Verify business placement and fix misplaced entries
- [x] Test mobile menu and SEO on all pages


## Phase 15: Category Filtering Fix
- [x] Analyze category filtering issue in getAllBusinesses endpoint
- [x] Fix server-side API to properly filter by categoryId
- [x] Verify frontend CategoryPage query is correct
- [x] Write and run 4 new category filtering tests (all passing)
- [x] Verify category filtering works end-to-end with verification script
- [x] Confirm map shows only businesses from selected category


## Phase 16: Strict Location Cleanup - Trogir-Omiš Region Only
- [x] Create strict location filter script (only Split, Solin, Trogir, Kaštela, Omiš, Dugopolje, Stobrec, Podstrana)
- [x] Delete 448 businesses from Belgrade, Zagreb, Bosnia, islands, and other cities
- [x] Verify no businesses remain outside allowed region (1057 remaining)
- [x] Test all 16 categories with businesses (3 empty: Krovopokrivači, Slikari, Hoteli)
- [x] Verify weighted sorting (70% reviews, 30% rating)
- [x] Verify gender filter for frizerski saloni (13 muški, 30 ženski, 154 oba)
- [x] Update tests to reflect new business counts
- [x] All 33 vitest tests passing
