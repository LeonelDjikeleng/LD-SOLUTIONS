import { test } from "node:test";
import assert from "node:assert/strict";
import { validerDemande, validerEvenement, normaliserUrl } from "../../server/lib/validation.mjs";

const base = { type: "creation", nom: "Marie Tremblay", courriel: "marie@exemple.ca" };

test("une demande de création minimale est acceptée", () => {
  const r = validerDemande(base);
  assert.equal(r.ok, true);
  assert.equal(r.donnees.type, "creation");
  assert.equal(r.donnees.suspect, false);
});

test("nom, courriel et type sont obligatoires", () => {
  const r = validerDemande({});
  assert.equal(r.ok, false);
  assert.ok(r.erreurs.type && r.erreurs.nom && r.erreurs.courriel);
});

test("courriels invalides refusés", () => {
  for (const c of ["abc", "a@b", "a b@c.ca", "<x>@y.ca"]) {
    assert.equal(validerDemande({ ...base, courriel: c }).ok, false, c);
  }
});

test("audit et maintenance exigent l'adresse du site", () => {
  assert.equal(validerDemande({ ...base, type: "audit" }).ok, false);
  assert.equal(validerDemande({ ...base, type: "maintenance" }).ok, false);
  const r = validerDemande({ ...base, type: "audit", site_actuel: "www.garage.ca" });
  assert.equal(r.ok, true);
  assert.equal(r.donnees.site_actuel, "https://www.garage.ca/");
});

test("discussion exige un message d'au moins 10 caractères", () => {
  assert.equal(validerDemande({ ...base, type: "discussion", message: "court" }).ok, false);
  assert.equal(validerDemande({ ...base, type: "discussion", message: "Je veux discuter d'un projet." }).ok, true);
});

test("les choix hors liste sont refusés", () => {
  assert.equal(validerDemande({ ...base, formule: "gratuit" }).ok, false);
  assert.equal(validerDemande({ ...base, secteur: "inconnu" }).ok, false);
});

test("URL dangereuses refusées", () => {
  assert.equal(normaliserUrl("javascript:alert(1)"), null);
  assert.equal(normaliserUrl("localhost"), null);
});

test("champ piège et envoi trop rapide marquent la demande comme suspecte", () => {
  assert.equal(validerDemande({ ...base, adresse_complementaire: "x" }).donnees.suspect, true);
  const r = validerDemande({ ...base, t: String(Date.now() - 500) });
  assert.equal(r.donnees.suspect, true);
  assert.equal(validerDemande({ ...base, t: String(Date.now() - 10_000) }).donnees.suspect, false);
});

test("les caractères de contrôle sont supprimés et les longueurs bornées", () => {
  const r = validerDemande({ ...base, message: "a\u0000b" + "x".repeat(6000) });
  assert.equal(r.donnees.message.startsWith("ab"), true);
  assert.equal(r.donnees.message.length, 5000);
});

test("événements : liste blanche et page normalisée", () => {
  assert.deepEqual(validerEvenement({ nom: "page_vue", page: "/tarifs/?x=1" }), { nom: "page_vue", page: "/tarifs/" });
  assert.equal(validerEvenement({ nom: "pirate", page: "/" }), null);
  assert.equal(validerEvenement({ nom: "page_vue", page: "<script>" }).page, "/");
});

test("les champs d'une ligne ne peuvent pas contenir de retour à la ligne (injection d'en-têtes)", () => {
  const r = validerDemande({ ...base, nom: "Jean\r\nBcc: pirate@x.com", entreprise: "A\nB" });
  assert.equal(r.donnees.nom, "Jean Bcc: pirate@x.com");
  assert.equal(r.donnees.entreprise, "A B");
});
