package tecnm.equipo4.barberoApi.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "id_barbero")
    private Long idBarbero;

    @Lob
    @Column(name = "foto", columnDefinition = "LONGBLOB")
    private byte[] foto;
}