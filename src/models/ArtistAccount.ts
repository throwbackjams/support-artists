import * as borsh from '@project-serum/borsh'

export class ArtistAccount {
    name: string;
    about: string;
    wallet: string;
    bump: number;
    
    constructor(name: string, about: string, wallet: string, bump: number) {
        this.name = name;
        this.about = about;
        this.wallet = wallet;
        this.bump = bump
    }

    static borschAccountSchema = borsh.struct([
        borsh.str('name'),
        borsh.str('about'),
        borsh.str('wallet'),
        borsh.u8('bump'),
    ])

}