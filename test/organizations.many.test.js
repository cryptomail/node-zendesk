/* eslint-disable no-await-in-loop */
import dotenv from 'dotenv';
import {describe, expect, it} from 'vitest';
import {setupClient, generateMultipleOrganizations} from './setup.js';
import {JobRunner} from './job-runner.js';

dotenv.config();

describe('Zendesk Client Organizations(many/bulk)', () => {
  const testOrganizations = [];
  let organizationsToCreate = [];

  const client = setupClient();
  const jobs = new JobRunner(client);

  it(
    'should create multiple organizations',
    async () => {
      await jobs.run(
        async () => {
          organizationsToCreate = generateMultipleOrganizations(30);
          return client.organizations.createMany({
            organizations: organizationsToCreate,
          });
        },
        async (finalJobResults) => {
          const createdOrgIDs = finalJobResults.results.map((org) => org.id);
          const orgDetails = await client.organizations.showMany(createdOrgIDs);

          expect(orgDetails.length).toBe(
            createdOrgIDs.length,
            `Expected ${createdOrgIDs.length} organizations, but got ${orgDetails.length}`,
          );

          for (const org of organizationsToCreate) {
            const orgDetail = orgDetails.find(
              (detail) => detail.name === org.name,
            );
            expect(orgDetail).toBeTruthy(
              `Expected to find organization with name ${org.name}, but did not.`,
            );
            testOrganizations.push(orgDetail);
          }
        },
      );
    },
    {timeout: 20_000},
  );

  it(
    'should update multiple organizations',
    async () => {
      await jobs.run(
        async () => {
          const ids = testOrganizations.map((org) => org.id);
          return client.organizations.updateMany({
            organizations: [
              {id: ids[0], notes: 'updatedFoo'},
              {id: ids[1], notes: 'updatedBar'},
            ],
          });
        },
        async (finalUpdateJobResults) => {
          const updatedOrgIDs = finalUpdateJobResults.results.map(
            (org) => org.id,
          );
          const updatedOrgDetails =
            await client.organizations.showMany(updatedOrgIDs);

          const updatedNotes = updatedOrgDetails.map((org) => org.notes);
          expect(updatedNotes).toContain(
            'updatedFoo',
            `Expected notes to contain 'updatedFoo', but found ${updatedNotes}`,
          );
          expect(updatedNotes).toContain(
            'updatedBar',
            `Expected notes to contain 'updatedBar', but found ${updatedNotes}`,
          );
        },
      );
    },
    {timeout: 20_000},
  );

  it(
    'should bulk delete organizations',
    async () => {
      await jobs.run(
        async () => {
          const ids = testOrganizations.map((org) => org.id);
          return client.organizations.bulkDelete(ids);
        },
        async (finalDeleteJobResults) => {
          const deletedOrgIDs = finalDeleteJobResults.results.map(
            (org) => org.id,
          );
          for (const orgId of deletedOrgIDs) {
            try {
              const orgDetail = await client.organizations.show(orgId);
              expect(orgDetail).toBeNull(
                `Expected organization with ID ${orgId} to be deleted, but it was found.`,
              );
            } catch (error) {
              expect(error.message).toContain(
                'Item not found',
                `Expected 'Item not found' error, but got: ${error.message}`,
              );
            }
          }
        },
      );
    },
    {timeout: 20_000},
  );
});
