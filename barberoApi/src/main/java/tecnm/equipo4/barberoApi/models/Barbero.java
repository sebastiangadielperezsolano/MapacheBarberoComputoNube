package tecnm.equipo4.barberoApi.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "barbero")
public class Barbero {

    @Id
    @Column(name = "id_barbero")
    private Long idBarbero;

    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "experiencia")
    private Integer experiencia;

    @Column(name = "titulo_rol")
    private String tituloRol;
}