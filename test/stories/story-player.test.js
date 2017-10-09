/**
 * Story player service.
 *
 * @author Chris Spiliotopoulos
 */


import chai from 'chai';
import sinon from 'sinon';
import SinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

import DataStory from '../../src/stories/data-story';
import StoryPlayer from '../../src/stories/story-player';

chai.should();
chai.use(SinonChai);
chai.use(chaiAsPromised);

const sandbox = sinon.sandbox.create();


context('Story player', () => {

  afterEach(() => {
    sandbox.restore();
  });

  context('play()', () => {

    let story;

    beforeEach(() => {
      const definition = fs.readFileSync(`${__dirname}/data/basic-story.yaml`, 'utf-8');

      story = new DataStory({
        definition
      });
    });

    it('should be rejected if story is undefined', () => {
      const promise = StoryPlayer.play();
      return promise.should.be.rejectedWith('Invalid story instance');
    });

    it('should be rejected if Open API spec is invalid', () => {
      story.definition.spec = undefined;
      const promise = StoryPlayer.play(story);
      return promise.should.be.rejectedWith('Invalid Open API spec');
    });

  });


});
