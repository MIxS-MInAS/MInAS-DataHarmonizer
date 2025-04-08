# MIxS MInAS instructions

## Initial Setup

- Clone the repository
- Install all dependencies set up as described below in the original [DataHarmonizer](https://github.com/cidgoh/DataHarmonizer?tab=readme-ov-file#prerequisites) with `yarn`
  - Configure `corepack` so `yarn` works properly
  - Run `yarn` to install dependencies
- Make sure you've installed [LinkML](https://linkml.io/)
- Make sure you've installed [linkml-toolkit](https://github.com/genomewalker/linkml-toolkit)
- Delete most of the contents of `/web/templates/` (leave one example until the new templates are added, e.g. keep `mpox`, and also `new/` for reference)
- Delete most of the contents of `menu.json` (leave one example until the new templates are added)
  - Set the example entries to `"display": false` in `menu.json`.

The instructions for adding a **single extension** to this repo's DataHarmonizer instance:

- Change into `cd web/templates`
- Make a directory `mixs-minas/`
- Add to directory a file `export.js` just containing `export default {};`

  ```bash
  echo "export default {};" > web/templates/mixs-minas/export.js`
  ```

  - Write a txt file called (`web/templates/mixs-minas/dh_class_text.txt`) which includes the text for an additional classed called [`dh_interface` class](https://github.com/cidgoh/DataHarmonizer?tab=readme-ov-file#making-templates)

    ```yaml
    dh_interface:
      name: dh_interface
      description: A DataHarmonizer interface
      from_schema: https://github.com/MIxS-MInAS/minas
    MInAS-checklists:
      name: MInAS-checklists
      description:
        The Minimum Information about any Ancient Sequence (MInAS) project aims
        to develop standardised metadata reporting schemes of ancient DNA samples and
        sequencing data via community-based consensus and training.
        This checklist contains relevant aDNA MIxS combinations plus the ancient and
        radiocarbon extension
      is_a: dh_interface
    ```

    > [!WARNING]
    > Ensure you keep the leading tab indentation!

## Creating the DataHarmonizer compatible schema

- Download the mixs-minas latest release's schema

  ```bash
  MIXS_MINAS_VERSION=0.4.0
  curl -o web/templates/mixs-minas/mixs-minas.yaml https://raw.githubusercontent.com/MIxS-MInAS/MInAS/refs/tags/v$MIXS_MINAS_VERSION/src/mixs/schema/mixs-minas.yaml
  ```

  - Subset the mega schema to just those combinations relevant to MInAS (i.e., the ones in `minas-combinations.yml`)

  ```bash
  ## Update based on combinations from `minas-combinations.yml`
  lmtk subset --schema mixs-minas.yaml --output minas.yml --classes MixsCompliantData,Ancient,RadiocarbonDating,MigsOrgHostAssociatedAncient,MigsOrgHumanAssociatedAncient,MiuvigHostAssociatedAncient,MiuvigHumanAssociatedAncient,MimagHostAssociatedAncient,MimagHumanAssociatedAncient,MimagHumanOralAncientMimagHumanGutAncient,MimagHumanSkinAncient,MimagSedimentAncient,MimagSkinAncient,MimsHostAssociatedAncient,MimsHumanAssociatedAncient,MimsHumanOralAncient,MimsHumanGutAncient,MimsHumanSkinAncient,MimsSedimentAncient,MimsSoilAncient,MimsPlantAncient,MimsSymbiontAncient
  ```

  - Inject the `dh_class` into the `schema.yaml` file with e.g.

  ```bash
  sed -i '/^classes:/r web/templates/mixs-minas/dh_class_text.txt' minas.yml
  ```

  - Generate the DataHarmonizer compatible JSON with:

  ```bash
  python ../../../script/linkml.py -i minas.yml
  ```

  - Modify the `/web/templates/menu.json` so all `"display": false` equals `"display": true`

    ```bash
    ## This works by finding the first string, then in the replacement pattern skip two lines (N;), then perform the actual replacement
    sed -i "/Ancient\"\,/{N;N;s/false/true/g}" ../menu.json
    sed -i "/RadiocarbonDating\"\,/{N;N;s/false/true/g}" ../menu.json
    ```

## Testing the DataHarmonizer instance

- Test in a local web server
  - Open a local webserver with `yarn dev`
  - Check you can see the new template under 'Template:` in the top bar

## Generating the static DataHarmonizer files

- Generate the static files (within the local clone) in `/web/dost`

  ```bash
  yarn build:web
  ```

- Remove the old docs directory at the root of the repository

  ```bash
  cd ../../../
  rm -r docs/
  ```

- Copy the new files into `docs/` to allow rendering on GitHub pages

  ```bash
  cp -r web/dist/ docs/
  ```
